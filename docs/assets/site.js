'use strict'

const byId = id => document.getElementById(id)
const query = new URLSearchParams(location.search)

const topics = new Map([
  ['music', { name: 'Music', hello: 'What song is on repeat for you this week?' }],
  ['late-night', { name: 'Late Night', hello: 'What’s something you’ve been thinking about lately?' }],
  ['games', { name: 'Games', hello: 'What’s a game you’d happily play with someone new?' }]
])

const prompts = new Map([
  ['small-win', 'What’s a tiny thing that made your week better?'],
  ['first-listen', 'What song do you wish you could hear for the first time again?'],
  ['open-window', 'If you could open a window anywhere right now, what would you see?']
])

const plans = new Map([
  ['week', { name: 'One-week Spark Pass', total: '₹49 for 7 days from purchase.' }],
  ['month', { name: 'One-month Spark Pass', total: '₹99 for one month from purchase.' }]
])

function setupChat() {
  const entry = byId('guest-entry')
  const alias = byId('alias')
  const topic = byId('topic')
  const selectedPrompt = prompts.get(query.get('prompt'))
  const transcript = byId('messages')
  const reply = byId('message')
  const report = byId('report-dialog')
  const reportForm = byId('report-form')
  const panels = [...document.querySelectorAll('.split-layout > .panel')]
  const aliases = ['Fern', 'Cloudlane', 'QuietOrbit', 'NightTea']
  const replies = [
    'I like that answer. What got you into it?',
    'That’s a good detail. I always like the part of a story people almost leave out.',
    'I’m glad we started with that question. Thanks for chatting.'
  ]
  let aliasIndex = Math.floor(Math.random() * aliases.length)
  let replyIndex = 0

  function showPanel(panelId, focusId) {
    for (const panel of panels) panel.hidden = panel.id !== panelId
    byId(focusId).focus()
  }

  function addMessage(text, isGuest = false) {
    const bubble = document.createElement('p')
    const speaker = document.createElement('strong')
    bubble.className = isGuest ? 'bubble bubble-you' : 'bubble'
    speaker.className = 'speaker'
    speaker.textContent = isGuest ? alias.value.trim() + ' (you)' : 'Moonlit'
    bubble.append(speaker, document.createTextNode(text))
    transcript.append(bubble)
    transcript.scrollTop = transcript.scrollHeight
  }

  function endChat(title, note) {
    transcript.replaceChildren()
    reply.value = ''
    reportForm.reset()
    byId('ended-title').textContent = title
    byId('ended-note').textContent = note
    showPanel('ended-panel', 'ended-title')
  }

  if (topics.has(query.get('topic'))) {
    topic.value = query.get('topic')
    byId('optional-topic').open = true
  }

  if (selectedPrompt) {
    const entryPrompt = byId('entry-prompt')
    entryPrompt.textContent = 'Your starter question: ' + selectedPrompt
    entryPrompt.hidden = false
    byId('use-prompt').hidden = false
  }

  byId('suggest-alias').addEventListener('click', () => {
    alias.value = aliases[aliasIndex]
    aliasIndex = (aliasIndex + 1) % aliases.length
    alias.setCustomValidity('')
    alias.focus()
  })

  alias.addEventListener('input', () => alias.setCustomValidity(''))
  entry.addEventListener('submit', event => {
    event.preventDefault()
    if (alias.value.trim().length < 2) {
      alias.setCustomValidity('Enter an alias with at least two characters.')
      alias.reportValidity()
      return
    }
    alias.value = alias.value.trim()
    const preference = topics.get(topic.value)
    byId('waiting-title').textContent = preference ? 'Looking for a ' + preference.name + ' chat' : 'Looking for a partner'
    showPanel('waiting-panel', 'waiting-title')
  })

  byId('cancel-search').addEventListener('click', () => showPanel('entry-panel', 'alias'))
  byId('meet-partner').addEventListener('click', () => {
    replyIndex = 0
    showPanel('chat-panel', 'chat-title')
    const preference = topics.get(topic.value)
    addMessage(preference?.hello || 'Hey. What’s something good you’ve come across today?')
  })

  byId('message-form').addEventListener('submit', event => {
    event.preventDefault()
    const text = reply.value.trim()
    if (!text) {
      reply.focus()
      return
    }
    addMessage(text, true)
    reply.value = ''
    if (replyIndex < replies.length) {
      addMessage(replies[replyIndex])
      replyIndex += 1
    }
    reply.focus()
  })

  byId('use-prompt').addEventListener('click', () => {
    reply.value = selectedPrompt
    reply.focus()
  })

  byId('leave-chat').addEventListener('click', () => endChat('You left the chat.', 'The demo conversation was cleared.'))
  byId('block-alias').addEventListener('click', () => endChat('Block preview complete.', 'The demo conversation was cleared. This preview shows what a block confirmation could look like.'))
  byId('restart-chat').addEventListener('click', () => showPanel('entry-panel', 'alias'))
  byId('report-chat').addEventListener('click', () => report.showModal())
  byId('close-report').addEventListener('click', () => report.close())
  reportForm.addEventListener('submit', event => {
    event.preventDefault()
    report.close()
    endChat('Report preview complete.', 'The demo conversation was cleared. Nothing was sent to a moderator.')
  })

  byId('entry-panel').hidden = false
}

function setupRooms() {
  const filter = byId('room-filter')
  const clear = byId('clear-filter')
  const cards = [...document.querySelectorAll('[data-topics]')]
  function showMatchingRooms() {
    const term = filter.value.trim().toLowerCase()
    let shown = 0
    for (const card of cards) {
      const searchable = card.dataset.topics + ' ' + card.textContent.toLowerCase()
      card.hidden = !searchable.includes(term)
      if (!card.hidden) shown += 1
    }
    byId('room-result').textContent = shown === 1 ? '1 room preview' : shown + ' room previews'
    byId('rooms-empty').hidden = shown !== 0
    clear.hidden = filter.value === ''
  }
  filter.addEventListener('input', showMatchingRooms)
  clear.addEventListener('click', () => {
    filter.value = ''
    showMatchingRooms()
    filter.focus()
  })
  showMatchingRooms()
  filter.closest('.room-search').hidden = false
}

function setupPrompts() {
  const status = byId('share-status')
  for (const button of document.querySelectorAll('[data-share]')) {
    button.hidden = false
    button.addEventListener('click', async () => {
      const url = new URL(location.href)
      url.search = ''
      url.hash = button.dataset.share
      try {
        await navigator.clipboard.writeText(url.href)
        status.textContent = 'Prompt link copied.'
      } catch {
        status.replaceChildren(document.createTextNode('Copy this link: '))
        const link = document.createElement('a')
        link.href = url.href
        link.textContent = url.href
        status.append(link)
      }
    })
  }
}

function setupPass() {
  const plan = query.get('plan')
  const form = byId('pass-form')
  if (form) {
    if (plans.has(plan)) form.elements.plan.value = plan
    form.addEventListener('change', event => {
      const url = new URL(location.href)
      url.searchParams.set('plan', event.target.value)
      history.replaceState(null, '', url)
    })
  } else if (plans.has(plan)) {
    const selection = plans.get(plan)
    byId('review-title').textContent = selection.name
    byId('review-total').textContent = selection.total
    byId('change-pass').href = 'pass.html?plan=' + encodeURIComponent(plan)
  }
}

const setup = {
  chat: setupChat,
  rooms: setupRooms,
  prompts: setupPrompts,
  pass: setupPass,
  'pass-review': setupPass
}
setup[document.body.dataset.page]?.()
