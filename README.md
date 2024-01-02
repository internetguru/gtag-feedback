# Feedback.js

> Send feedback to Google Tag Manager.

## Usage

1. Init Google Tag Manager.
2. Include feedback.js and feedback.css to your project HTML `<head>`. E.g. using [raw.githack.com](https://raw.githack.com/)
    ```html
    <script type='text/javascript' src="https://raw.githack.com/internetguru/gtag-feedback/main/feedback.js"></script>
    <link rel="stylesheet" type="text/css" href="https://raw.githack.com/internetguru/gtag-feedback/main/feedback.css" />
    ```
3. Create html root element, e.g.

    ```html
    <div class='feedback'></div>
    ```
4. Init Feedback, e.g
    ```html
    <script>
    let feedback = new Feedback({
        parentElement: document.querySelector('.feedback'),
        emailLabel: '@lang('feedback.email.label')',
        textareaLabel: '@lang('feedback.comment.label')',
        submitText: '@lang('feedback.submit')',
        title: '@lang('feedback.title')',
        successText: '@lang('feedback.sent')',
        extraParams: {
            'version': '{{ getAppInfo() }}'
        },
    })
    </script>
    ```

## Configuration

- parentElement (default: `null`)
- title (default: `Feedback`)
- star (default: `★`)
- formClass (default: `js-feedback-form`)
- starContainerClass (default: `js-feedback-star-container`)
- starActiveClass (default: `js-feedback-star-active`)
- textareaLabel (default: `Message`)
- textareaClass (default: `js-feedback-message`)
- emailLabel (default: `Email for response`)
- emailClass (default: `js-feedback-email`)
- submitText (default: `Send feedback`)
- successText (default: `Thank you for your feedback!`)
- missingGtag (default: `Missing Google Tag manager`)
- emptyMessageConfirm (default: `Are you sure you want to send empty message? Empty message leads to no action.`)
- extraParams (default: `{}`)
- debug (default: `false`)

## Email decrypt

```bash
cd path-to-project
npm install
# run node
node
# paste to node terminal replacing 'encrypted-email' with actual value
var CryptoJS = require("crypto-js")
CryptoJS.AES.decrypt('encrypted-email', 'email-secret-phrase').toString(CryptoJS.enc.Utf8)
```
