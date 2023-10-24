class Feedback {

  #stars = 0
  #email = ''
  #text = ''
  #settings = {}
  #defaultSettings = {
    parentElement: null,
    title: `Feedback`,
    star: '★',
    formClass: 'js-feedback-form',
    starContainerClass: 'js-feedback-star-container',
    starActiveClass: 'js-feedback-star-active',
    textareaLabel: 'Message',
    textareaClass: 'js-feedback-message',
    emailLabel: 'Email for response',
    emailClass: 'js-feedback-email',
    submitText: 'Send feedback',
    successText: 'Thank you for your feedback!',
    missingGtag: 'Missing Google Tag manager',
    debug: false
  }

  constructor(settings) {
    this.#settings = Object.assign(this.#defaultSettings, settings)
    if (typeof gtag !== 'function') {
      this.#settings.parentElement.innerHTML = `<div class="alert alert-danger" role="alert">${this.#settings.missingGtag}</div>`
      return
    }
    this.initLibs()
    this.createForm()
    this.createStarRating()
    this.initOpenEvent()
  }

  initLibs() {
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js'
    document.head.appendChild(script)
  }

  createStarRating() {
    this.starContainer = this.#settings.parentElement.querySelector(`.${this.#settings.starContainerClass}`)
    for (let i = 1; i <= 5; i++) {
      let star = document.createElement('span')
      star.innerHTML = '★'
      star.addEventListener('click', () => {
        this.#stars = i
        this.highlightStars(i)
      })
      this.starContainer.appendChild(star)
    }
  }

  highlightStars(n) {
    const stars = this.starContainer.childNodes
    for(let i = 0; i < stars.length; i++){
      stars[i].className = i < n ? this.#settings.starActiveClass : ''
    }
  }

  createForm() {
    // Creating form
    this.form = document.createElement('form')
    this.form.className = this.#settings.formClass
    this.form.innerHTML = `
        <details>
            <summary>
                <span class="fw-normal h5">${this.#settings.title}</span>
                <span class="${this.#settings.starContainerClass}"></span>
            </summary>
            <div class="form-floating mb-3">
                <textarea class="form-control" id="floatingComment" name="comment" style="height: 6em;" placeholder="..."></textarea>
                <label for="floatingComment">${this.#settings.textareaLabel}</label>
            </div>
            <div class="form-floating mb-3">
                <input class="form-control" type="email" id="floatingEmail" name="email" placeholder="john@doe.com"/>
                <label for="floatingEmail">${this.#settings.emailLabel}</label>
            </div>
            <div class="form-group mt-3">
                <input class="btn btn-primary" type="submit" value="${this.#settings.submitText}" />
            </div>
        </details>
    </form>
    `
    this.textArea = this.form.querySelector('textarea')
    this.emailInput = this.form.querySelector('input[type="email"]')
    let submitBtn = this.form.querySelector('input[type="submit"]')
    submitBtn.innerText = 'Send'
    submitBtn.addEventListener('click', (event) => {
      event.preventDefault()
      this.sendFeedback()
      this.form.dispatchEvent(new Event('submit'))
    })
    this.#settings.parentElement.appendChild(this.form)
  }

  initOpenEvent() {
    const details = this.form.querySelector('details')
    const summary = this.form.querySelector('summary')
    const stars = this.starContainer.querySelectorAll(`span`)
    summary.addEventListener('click', (event) => event.preventDefault())
    summary.style.display = 'block';
    stars.forEach((star) => {
        star.addEventListener('click', () => {
            details.setAttribute('open', 'open')
        })
    })

  }

  textToBase64(text) {
    const bytes = new TextEncoder().encode(text)
    const binString = String.fromCodePoint(...bytes)
    return btoa(binString)
  }

  sendFeedback() {
    this.#text = this.textArea.value
    this.#email = this.emailInput.value
    const data = {
      'raiting': this.#stars,
      'stars': '*'.repeat(this.#stars),
      'text': this.#text,
      // CryptoJS.AES.decrypt(val, 'email-secret-phrase').toString(CryptoJS.enc.Utf8)
      'email': CryptoJS.AES.encrypt(this.#email, 'email-secret-phrase').toString()
    }
    if (this.#settings.debug) {
      console.log(data)
    } else {
      // Send feedback to Google Analytics
      gtag('event', 'feedback', data)
    }
    this.#settings.parentElement.innerHTML = `<div class="alert alert-success" role="alert">${this.#settings.successText}</div>`
  }
}
