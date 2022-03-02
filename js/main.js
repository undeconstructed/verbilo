
function setupVerbtool(eContainer) {
  let handleSize = 5
  let boxWidth = 800
  let nowAt = boxWidth / 2

  let calculate = () => {
    let s = eSubject.value
    let v = eVerb.value
    let o = eObject.value

    let started = left <= nowAt
    let finished = left + width < nowAt

    let sentences = []
    if (nowAt == (boxWidth/2)) {
      // current time
      if (!started) {
        sentences.push(`${s} ${v}os ${o}n`)
        sentences.push(`${s} estas ${v}onta ${o}n`)
        if (o) {
           sentences.push(`${o} ${v}iĝos`)
           sentences.push(`${o} estas ${v}ota`)
        }
      } else if (!finished) {
        sentences.push(`${s} ${v}as ${o}n`)
        sentences.push(`${s} estas ${v}anta ${o}n`)
        if (o) {
           sentences.push(`${o} ${v}iĝas`)
           sentences.push(`${o} estas ${v}ata`)
        }
      } else {
        sentences.push(`${s} ${v}is ${o}n`)
        sentences.push(`${s} estas ${v}inta ${o}n`)
        if (o) {
           sentences.push(`${o} ${v}iĝis`)
           sentences.push(`${o} estas ${v}ita`)
        }
      }
    } else if (nowAt < (boxWidth/2)) {
      // past
      if (!started) {
        sentences.push(`${s} estis ${v}onta ${o}n`)
        if (o) {
           sentences.push(`${o} estis ${v}ota`)
        }
      } else if (!finished) {
        sentences.push(`${s} estis ${v}anta ${o}n`)
        if (o) {
           sentences.push(`${o} estas ${v}ata`)
        }
      } else {
        sentences.push(`${s} estis ${v}inta ${o}n`)
        if (o) {
           sentences.push(`${o} estis ${v}ita`)
        }
      }
    } else if (nowAt > (boxWidth/2)) {
      // future
      if (!started) {
        sentences.push(`${s} estos ${v}onta ${o}n`)
        if (o) {
           sentences.push(`${o} estos ${v}ota`)
        }
      } else if (!finished) {
        sentences.push(`${s} estos ${v}anta ${o}n`)
        if (o) {
           sentences.push(`${o} estos ${v}ata`)
        }
      } else {
        sentences.push(`${s} estos ${v}inta ${o}n`)
        if (o) {
           sentences.push(`${o} estos ${v}ita`)
        }
      }
    }

    let list = document.createElement('ul')
    for (let s of sentences) {
      let li = document.createElement('li')
      li.textContent = s
      list.append(li)
    }
    eSentences.replaceChildren(list)
  }

  // top level elements

  let eWords = eContainer.querySelector('.words')
  let eTimeBox = eContainer.querySelector('.timebox')
  let eSentences = eContainer.querySelector('.sentences')

  // words input

  let eSubject = eWords.querySelector('[name=subject]')
  let eVerb = eWords.querySelector('[name=verb]')
  let eObject = eWords.querySelector('[name=object]')

  eSubject.addEventListener('change', calculate)
  eVerb.addEventListener('change', calculate)
  eObject.addEventListener('change', calculate)

  // time box + dragging

  let eEye = eTimeBox.querySelector('.eye')
  let eAction = eTimeBox.querySelector('.actionbox')
  let eStart = eAction.querySelector('.start')
  let eBody = eAction.querySelector('.body')
  let eEnd = eAction.querySelector('.end')

  let eyeWidth = 40
  let eyeLeft = (boxWidth - eyeWidth) / 2
  let left = 0 // default position is far left
  let width = 50

  let dragStartLeft = 0
  let currentLeft = left
  let currentWidth = width
  let currentEyeLeft = eyeLeft

  eEye.addEventListener('mousedown', e => {
    e.preventDefault()
    let mouseMove = e => {
      let dLeft = e.pageX - dragStartLeft
      let newLeft = eyeLeft + dLeft
      newLeft = Math.min(newLeft, boxWidth-eyeWidth)
      newLeft = Math.max(newLeft, 0)
      if (newLeft > (boxWidth/2)-(eyeWidth/2) && newLeft < (boxWidth/2)+(eyeWidth/2)) {
        newLeft = boxWidth/2
      }
      currentEyeLeft = newLeft
      eEye.style.left = (currentEyeLeft - eyeWidth/2) + 'px'
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

  eBody.addEventListener('mousedown', e => {
    e.preventDefault()
    let mouseMove = e => {
      let dLeft = e.pageX - dragStartLeft
      let newLeft = left + dLeft
      newLeft = Math.min(newLeft, boxWidth-width)
      newLeft = Math.max(newLeft, 0)
      currentLeft = newLeft
      eAction.style.left = currentLeft + 'px'
    }
    let mouseUp = e => {
      document.removeEventListener('mousemove', mouseMove, { capture: true })
      document.removeEventListener('mouseup', mouseUp, { capture: true })
      left = currentLeft
      calculate()
    }
    dragStartLeft = e.pageX
    document.addEventListener('mousemove', mouseMove, { capture: true })
    document.addEventListener('mouseup', mouseUp, { capture: true })
  })

  eStart.addEventListener('mousedown', e => {
    e.preventDefault()
    let mouseMove = e => {
      let dLeft = e.pageX - dragStartLeft
      let newLeft = Math.max(left + dLeft, 0)
      let realDLeft = left - newLeft
      let newWidth = width + realDLeft
      newWidth = Math.min(newWidth, boxWidth-left)
      newWidth = Math.max(newWidth, 10)
      currentLeft = newLeft
      currentWidth = newWidth
      eAction.style.left = currentLeft + 'px'
      eAction.style.width = currentWidth + 'px'
    }
    let mouseUp = e => {
      document.removeEventListener('mousemove', mouseMove, { capture: true })
      document.removeEventListener('mouseup', mouseUp, { capture: true })
      left = currentLeft
      width = currentWidth
      calculate()
    }
    dragStartLeft = e.pageX
    document.addEventListener('mousemove', mouseMove, { capture: true })
    document.addEventListener('mouseup', mouseUp, { capture: true })
  })

  eEnd.addEventListener('mousedown', e => {
    e.preventDefault()
    let mouseMove = e => {
      let dLeft = e.pageX - dragStartLeft
      let newWidth = width + dLeft
      newWidth = Math.min(newWidth, boxWidth-left)
      newWidth = Math.max(newWidth, 10)
      currentWidth = newWidth
      eAction.style.width = currentWidth + 'px'
    }
    let mouseUp = e => {
      document.removeEventListener('mousemove', mouseMove, { capture: true })
      document.removeEventListener('mouseup', mouseUp, { capture: true })
      width = currentWidth
      calculate()
    }
    dragStartLeft = e.pageX
    document.addEventListener('mousemove', mouseMove, { capture: true })
    document.addEventListener('mouseup', mouseUp, { capture: true })
  })

  calculate()
}

function main() {
  for (let e of document.querySelectorAll('.verbtool')) {
    setupVerbtool(e)
  }
}

document.addEventListener('DOMContentLoaded', main)
