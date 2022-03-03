
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

  self.start = zeroTime-50
  self.end = zeroTime+50

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

function setupVerbtool(eContainer) {
  // top level elements

  let eWords = eContainer.querySelector('.words')
  let eEvents = eContainer.querySelector('.events')
  let eEventLines = eEvents.querySelector('.lines')
  let eSentences = eContainer.querySelector('.sentences')

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
    let sentences = []
    for (let e of events) {
      let started = e.start <= nowAt
      let finished = e.end < nowAt

      let s = e.s
      let v = e.v
      let o = e.o

      if (nowAt == (boxWidth/2)) {
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
      } else if (nowAt < (boxWidth/2)) {
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
      } else if (nowAt > (boxWidth/2)) {
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
  let nowAt = boxWidth / 2

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
  let eAddButton = eWords.querySelector('[name=button]')

  eAddButton.addEventListener('click', e => {
    e.preventDefault()
    let s = eSubject.value
    let v = eVerb.value
    let o = eObject.value
    eSubject.value = eVerb.value = eObject.value = ''
    addEvent(s, v, o)
    calculate()
  })

  addEvent('kato', 'ŝat', 'muso')
  addEvent('kato', 'kur')
}

function main() {
  for (let e of document.querySelectorAll('.verbtool')) {
    setupVerbtool(e)
  }
}

document.addEventListener('DOMContentLoaded', main)
