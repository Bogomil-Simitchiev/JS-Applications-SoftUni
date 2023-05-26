import { html } from '../lib/lit-html.js'

const aboutTemplate = () => 
html`
<h1>About us</h1>
<p>Our car website is dedicated to providing the latest news, reviews, and information about cars. We strive to be the go-to source for car enthusiasts and professionals alike. Our team is made up of experienced automotive journalists and experts who are passionate about all things related to cars.</p>
<p>Whether you're in the market for a new car or just love learning about the latest models, our website has everything you need to stay informed. From in-depth reviews to breaking news, we've got you covered.</p>
`

export function aboutView(ctx) {
    ctx.render(aboutTemplate());
}