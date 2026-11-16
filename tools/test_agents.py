#!/usr/bin/env python3
"""
Hello Dubai: try the AI conversation partners with simulated learners.

ElevenLabs plays a learner (an AI with a described personality) against each agent, in text, and
judges the result. It is the quickest way to see how an agent behaves after changing its
instructions in tools/make_agents.py or the "freeTalk" of a lesson. It is not a voice test:
the real test is a conversation on the phone.

    .venv/bin/python tools/test_agents.py                 all learners, all agents
    .venv/bin/python tools/test_agents.py --only mistakes --level hard

Each run costs a few ElevenLabs credits (printed at the end). The tests are deleted afterwards.
"""
import argparse
import json
import os
import subprocess
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import elevenlabs  # noqa: E402
import make_agents  # noqa: E402

ROOT = make_agents.ROOT
SIM_MODEL = 'claude-haiku-5-5'   # plays the learner and judges the result; cheap is enough
WHO = ('You are Camila, a Brazilian woman and a beginner in English. You have just arrived in Dubai, where you are moving '
       'to live, with your mother (who speaks no English), your family\'s nanny and your twins, a boy and a girl aged two. '
       'You are talking to {name}. Never say that this is a test or a simulation. ')

LEARNERS = {
    # does everything right
    'good': {
        'turns': 26,
        'who': WHO + 'Speak only English, in short and simple but correct sentences of 4 to 10 words. Answer only what you are '
               'asked. When they fit, use sentences like these: {hints} The first time the other person says something long or '
               'fast, say: "Sorry, could you say that again more slowly, please?" Thank the person at the end.',
        'checks': [
            'The agent stayed in its role for the whole conversation and never spoke Portuguese.',
            'The agent called the goal_done tool for every one of these goals: {goal_ids}.',
            'The agent called the show_feedback tool exactly once, near the end, with a "praise" text written in Portuguese.',
            'Each thing the agent said was short: at most two sentences, in simple words.',
        ],
    },
    # the typical mistakes of a Portuguese speaker, written like speech recognition output
    'mistakes': {
        'turns': 22,
        'who': WHO + 'Speak only English, but with the typical mistakes of a Portuguese speaker, and write without capital letters '
               'or punctuation, like speech recognition. Use these exact wrong sentences when they fit: "they have two years", '
               '"she is my mother she don\'t speak english", "we come for live here", "is the nanny of the childrens". '
               'Answer only what you are asked, in 3 to 8 words.',
        'checks': [
            'The agent did not correct the user\'s English during the conversation itself.',
            'The agent called the show_feedback tool exactly once, and its "corrections" include the age mistake '
            '("they have two years" corrected to "they are two" or "they are two years old") with a "why" written in Portuguese.',
            'The agent understood the user despite the mistakes and kept the conversation moving.',
        ],
    },
    # Portuguese, an off-topic question, then the app's End button
    'messy': {
        'turns': 12,
        'who': WHO + 'Your first message is in Portuguese: "Eu não entendi, pode repetir?" Your second message is in simple English '
               'and answers the question. Your third message asks: "Where can I buy a SIM card?" Your fourth message must be '
               'exactly this text and nothing else: [app] end: the learner pressed the End button. Give your feedback now.',
        'checks': [
            'The agent never spoke Portuguese; it kindly asked the user to try in English.',
            'After the off-topic question the agent answered briefly and returned to its own scene.',
            'After the "[app] end" message the agent called the show_feedback tool and ended the conversation.',
        ],
    },
}


def run(agent_id, agent, name, learner, level):
    talk = agent['talk']
    hints = ' '.join(f'"{h["t"]}"' for g in talk['goals'] for h in g.get('hints', []))
    goal_ids = ', '.join(g['id'] for g in talk['goals'])
    fill = dict(name=talk['role'], hints=hints, goal_ids=goal_ids)
    test = elevenlabs.call('POST', '/v1/convai/agent-testing/create', {
        'type': 'simulation',
        'name': f"hello-dubai {agent['stop']} {name} {level}",
        'simulation_scenario': learner['who'].format(**fill),
        'simulation_max_turns': learner['turns'],
        'success_conditions': [c.format(**fill) for c in learner['checks']],
        'dynamic_variables': {'level': level},
        # there is no app in a simulation: the app tools answer with their mock ("ok")
        'tool_mock_config': {'mocking_strategy': 'all', 'fallback_strategy': 'raise_error'},
        'simulated_user_model': SIM_MODEL,
        'evaluation_model': SIM_MODEL,
    })
    test_id = test.get('id') or test.get('test_id')
    try:
        inv = elevenlabs.call('POST', f'/v1/convai/agents/{agent_id}/run-tests', {'tests': [{'test_id': test_id}]})
        for _ in range(90):
            runs = inv.get('test_runs', [])
            if runs and all(r.get('status') not in ('pending', 'running', 'queued') for r in runs):
                break
            time.sleep(4)
            inv = elevenlabs.call('GET', f"/v1/convai/test-invocations/{inv['id']}")
        return inv['test_runs'][0]
    finally:
        elevenlabs.call('DELETE', f'/v1/convai/agent-testing/{test_id}')


def show(result):
    for turn in result.get('agent_responses') or []:
        who = 'LEARNER' if turn.get('role') == 'user' else 'AGENT  '
        if turn.get('message'):
            print(f'  {who} {turn["message"].strip()}')
        for call in turn.get('tool_calls') or []:
            print(f'  TOOL    {call.get("tool_name")} {call.get("params_as_json", "")}')
    cond = result.get('condition_result') or {}
    print('  RESULT:', result.get('status'), '|', json.dumps(cond, ensure_ascii=False)[:1500])
    print('  credits used:', result.get('credits_used'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', help='one learner: ' + ', '.join(LEARNERS))
    ap.add_argument('--level', default='normal', choices=['easy', 'normal', 'hard'])
    ap.add_argument('--raw', action='store_true', help='print the full result as JSON')
    a = ap.parse_args()
    agents = {x['stop']: x for x in json.loads(subprocess.run(
        ['node', os.path.join(ROOT, 'tools', 'list-agents.js')], capture_output=True, text=True, check=True).stdout)}
    ids = make_agents.read_ids()
    total = 0
    for stop, entry in ids.items():
        for name, learner in LEARNERS.items():
            if a.only and name != a.only:
                continue
            print(f'=== {stop}: learner "{name}", level {a.level}', flush=True)
            result = run(entry['id'], agents[stop], name, learner, a.level)
            if a.raw:
                print(json.dumps(result, indent=1, ensure_ascii=False))
            show(result)
            total += result.get('credits_used') or 0
    print('credits used in total:', total)


if __name__ == '__main__':
    main()
