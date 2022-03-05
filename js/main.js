
function newTimebox(s, v, o) {
  let self = {s, v, o, start: 0, end: 0, onChange: null}

  let onChange = () => {
    self.onChange && self.onChange()
  }

  let timeboxtmpl = document.querySelector('#eventlinetemplate').content.firstElementChild
  let newBox = timeboxtmpl.cloneNode(true)

  let eAction = newBox.querySelector('.eventbox')
  let eStart = eAction.querySelector('.start')
  let eBody = eAction.querySelector('.body')
  let eEnd = eAction.querySelector('.end')

  let label = `${s} ${v} ${o||''}`
  eBody.textContent = label
  eAction.title = label

  let boxWidth = 800
  let zeroTime = boxWidth/2

  self.start = zeroTime-100
  self.end = zeroTime+100

  let left = self.start
  let width = self.end - self.start
  eAction.style.left = left + 'px'
  eAction.style.width = width + 'px'

  eBody.addEventListener('mousedown', e => {
    e.preventDefault()
    let left1 = left
    let dragStartX = e.pageX
    let mouseMove = e => {
      let dX = e.pageX - dragStartX
      left1 = Math.max(left + dX, 0)
      left1 = Math.min(left1, boxWidth-width)
      eAction.style.left = left1 + 'px'
    }
    let mouseUp = e => {
      document.removeEventListener('mousemove', mouseMove, { capture: true })
      document.removeEventListener('mouseup', mouseUp, { capture: true })
      left = left1
      self.start = left
      self.end = left+width
      onChange()
    }
    document.addEventListener('mousemove', mouseMove, { capture: true })
    document.addEventListener('mouseup', mouseUp, { capture: true })
  })

  eStart.addEventListener('mousedown', e => {
    e.preventDefault()
    let left1 = left
    let width1 = width
    let dragStartX = e.pageX
    let mouseMove = e => {
      let dX = e.pageX - dragStartX
      left1 = Math.max(left + dX, 0)
      let dLeft = left - left1
      width1 = width + dLeft
      if (width1 < 10) {
        width1 = 10
        left1 = left+width-10
      }
      eAction.style.left = left1 + 'px'
      eAction.style.width = width1 + 'px'
    }
    let mouseUp = e => {
      document.removeEventListener('mousemove', mouseMove, { capture: true })
      document.removeEventListener('mouseup', mouseUp, { capture: true })
      left = left1
      width = width1
      self.start = left
      self.end  = left + width
      onChange()
    }
    document.addEventListener('mousemove', mouseMove, { capture: true })
    document.addEventListener('mouseup', mouseUp, { capture: true })
  })

  eEnd.addEventListener('mousedown', e => {
    e.preventDefault()
    let width1 = width
    let dragStartX = e.pageX
    let mouseMove = e => {
      let dX = e.pageX - dragStartX
      width1 = width + dX
      if (left+width1 > boxWidth) {
        width1 = boxWidth-left
      }
      width1 = Math.max(width1, 10)
      eAction.style.width = width1 + 'px'
    }
    let mouseUp = e => {
      document.removeEventListener('mousemove', mouseMove, { capture: true })
      document.removeEventListener('mouseup', mouseUp, { capture: true })
      width = width1
      self.end = self.start + width
      onChange()
    }
    document.addEventListener('mousemove', mouseMove, { capture: true })
    document.addEventListener('mouseup', mouseUp, { capture: true })
  })

  self.element = newBox

  return self
}

function makeSomeSimpleSentences(events, nowAt, zeroTime) {
  let sentences = []

  for (let e of events) {
    let started = e.start <= nowAt
    let finished = e.end < nowAt

    let s = e.s
    let v = e.v
    let o = e.o

    if (nowAt == zeroTime) {
      // current time
      if (!started) {
        if (o) {
          sentences.push(`${s} ${v}os ${o}n`)
          sentences.push(`${s} estas ${v}onta ${o}n`)
          sentences.push(`${o} ${v}iĝos`)
          sentences.push(`${o} estas ${v}ota`)
        } else {
          sentences.push(`${s} ${v}os`)
          sentences.push(`${s} estas ${v}onta`)
        }
      } else if (!finished) {
        if (o) {
          sentences.push(`${s} ${v}as ${o}n`)
          sentences.push(`${s} estas ${v}anta ${o}n`)
          sentences.push(`${o} ${v}iĝas`)
          sentences.push(`${o} estas ${v}ata`)
        } else {
          sentences.push(`${s} ${v}as`)
          sentences.push(`${s} estas ${v}anta`)
        }
      } else {
        if (o) {
          sentences.push(`${s} ${v}is ${o}n`)
          sentences.push(`${s} estas ${v}inta ${o}n`)
          sentences.push(`${o} ${v}iĝis`)
          sentences.push(`${o} estas ${v}ita`)
        } else {
          sentences.push(`${s} ${v}is`)
          sentences.push(`${s} estas ${v}inta`)
        }
      }
    } else if (nowAt < zeroTime) {
      // past
      if (!started) {
        if (o) {
          sentences.push(`${s} estis ${v}onta ${o}n`)
          sentences.push(`${o} estis ${v}ota`)
        } else {
          sentences.push(`${s} estis ${v}onta`)
        }
      } else if (!finished) {
        if (o) {
          sentences.push(`${s} estis ${v}anta ${o}n`)
          sentences.push(`${o} estis ${v}ata`)
        } else {
          sentences.push(`${s} estis ${v}anta`)
        }
      } else {
        if (o) {
          sentences.push(`${s} estis ${v}inta ${o}n`)
          sentences.push(`${o} estis ${v}ita`)
        } else {
          sentences.push(`${s} estis ${v}inta`)
        }
      }
    } else if (nowAt > zeroTime) {
      // future
      if (!started) {
        if (o) {
          sentences.push(`${s} estos ${v}onta ${o}n`)
          sentences.push(`${o} estos ${v}ota`)
        } else {
          sentences.push(`${s} estos ${v}onta`)
        }
      } else if (!finished) {
        if (o) {
          sentences.push(`${s} estos ${v}anta ${o}n`)
          sentences.push(`${o} estos ${v}ata`)
        } else {
          sentences.push(`${s} estos ${v}anta`)
        }
      } else {
        if (o) {
          sentences.push(`${s} estos ${v}inta ${o}n`)
          sentences.push(`${o} estos ${v}ita`)
        } else {
          sentences.push(`${s} estos ${v}inta`)
        }
      }
    }
  }

  return sentences
}

function mainClause(e, nowAt, zeroTime, simple) {
  let started = e.start <= nowAt
  let finished = e.end < nowAt

  let l = ''
  if (!started) {
    l = 'o'
  } else if (!finished) {
    l = 'a'
  } else {
    l = 'i'
  }

  if (simple && nowAt == zeroTime) {
    if (e.o) {
      return `${e.s} ${e.v}${l}s ${e.o}n`
    } else {
      return `${e.s} ${e.v}${l}s`
    }
  } else {
    let rl = ''
    if (nowAt == zeroTime) {
      rl = 'a'
    } else if (nowAt < zeroTime) {
      rl = 'i'
    } else {
      rl = 'o'
    }
    if (e.o) {
      return `${e.s} est${rl}s ${e.v}${l}nta ${e.o}n`
    } else {
      return `${e.s} est${rl}s ${e.v}${l}nta`
    }
  }
}

function participle(mainEvent, sideEvent, active, time) {
  let started = false
  let finished = false
  if (time !== undefined) {
    started = sideEvent.start <= time
    finished = sideEvent.end < time
  } else {
    // any overlap is considered active
    started = sideEvent.start <= mainEvent.end
    finished = sideEvent.end < mainEvent.start
  }

  let l = ''

  if (!started) {
    l = 'o'
  } else if (!finished) {
    l = 'a'
  } else {
    l = 'i'
  }

  if (active) {
    if (sideEvent.o) {
      return `${sideEvent.v}${l}nte ${sideEvent.o}n`
    } else {
      return `${sideEvent.v}${l}nte`
    }
  } else {
    if (sideEvent.s) {
      return `${sideEvent.v}${l}te de ${sideEvent.s}`
    } else {
      return `${sideEvent.v}${l}te`
    }
  }
}

function trySomeMoreComplicatedSentences(events, nowAt, zeroTime) {
  let sentences = []

  for (let mainEvent of events) {
    let text = mainClause(mainEvent, nowAt, zeroTime, true)
    let time = undefined
    // XXX - this is reculation from mainClause
    if (nowAt >= mainEvent.start && nowAt <= mainEvent.end) {
      time = nowAt
    }
    for (let sideEvent of events) {
      if (sideEvent === mainEvent) {
        continue
      }
      if (sideEvent.s === mainEvent.s) {
        // main subject is side subject
        text += ', ' + participle(mainEvent, sideEvent, true, time)
      }
      if (sideEvent.o === mainEvent.s) {
        // main subject is side object
        text += ', ' + participle(mainEvent, sideEvent, false, time)
      }
    }
    sentences.push(text)
  }

  return sentences
}

function setupVerbtool(eContainer) {
  // top level elements

  let eWords = eContainer.querySelector('.words form')
  let eEvents = eContainer.querySelector('.events')
  let eEventLines = eEvents.querySelector('.lines')
  let eSentences = eContainer.querySelector('.sentences')
  let eClear = eContainer.querySelector('button[name=clear]')

  // state of things

  let events = []

  let addEvent = (s, v, o) => {
    let newBox = newTimebox(s, v, o)
    newBox.onChange = calculate
    events.push(newBox)
    eEventLines.append(newBox.element)
    calculate()
  }

  let calculate = () => {
    // let sentences = makeSomeSimpleSentences(events, nowAt, zeroTime)
    let sentences = trySomeMoreComplicatedSentences(events, nowAt, zeroTime)

    let list = document.createElement('div')
    for (let s of sentences) {
      let li = document.createElement('p')
      li.textContent = s
      list.append(li)
    }
    eSentences.replaceChildren(list)
  }

  // event lines

  let eEye = eEvents.querySelector('.eye')

  let boxWidth = 800
  let zeroTime = boxWidth/2
  let nowAt = zeroTime

  let eyeWidth = 40
  let eyeLeft = (boxWidth - eyeWidth) / 2
  let dragStartLeft = 0
  let currentEyeLeft = eyeLeft

  eEye.addEventListener('mousedown', e => {
    e.preventDefault()
    let mouseMove = e => {
      let dLeft = e.pageX - dragStartLeft
      let newLeft = eyeLeft + dLeft
      newLeft = Math.min(newLeft, boxWidth-eyeWidth)
      newLeft = Math.max(newLeft, 0)
      if (newLeft > (boxWidth/2)-(eyeWidth) && newLeft < (boxWidth/2)) {
        newLeft = boxWidth/2 - eyeWidth/2
      }
      currentEyeLeft = newLeft
      eEye.style.left = currentEyeLeft + 'px'
    }
    let mouseUp = e => {
      document.removeEventListener('mousemove', mouseMove, { capture: true })
      document.removeEventListener('mouseup', mouseUp, { capture: true })
      eyeLeft = currentEyeLeft
      nowAt = eyeLeft + (eyeWidth/2)
      calculate()
    }
    dragStartLeft = e.pageX
    document.addEventListener('mousemove', mouseMove, { capture: true })
    document.addEventListener('mouseup', mouseUp, { capture: true })
  })

  // words input

  let eSubject = eWords.querySelector('[name=subject]')
  let eVerb = eWords.querySelector('[name=verb]')
  let eObject = eWords.querySelector('[name=object]')

  eWords.addEventListener('submit', e => {
    e.preventDefault()
    let s = eSubject.value
    let v = eVerb.value
    let o = eObject.value
    eSubject.value = eVerb.value = eObject.value = ''
    addEvent(s, v, o)
    calculate()
  })

  eClear.addEventListener('click', e => {
    e.preventDefault()
    for (let e of events) {
      eEventLines.removeChild(e.element)
    }
    events = []
    calculate()
  })

  // samples

  addEvent('kato', 'sekv', 'muso')
  addEvent('kato', 'kur')
  addEvent('muso', 'mok', 'kato')
}

function main() {
  for (let e of document.querySelectorAll('.verbtool')) {
    setupVerbtool(e)
  }
}

document.addEventListener('DOMContentLoaded', main)
