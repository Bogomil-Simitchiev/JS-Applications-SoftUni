import { html, render } from '../node_modules/lit-html/lit-html.js'

function handlerSend(e){
    e.preventDefault();

}

const contactTemplate = () => html`
<h1>Contact us</h1>
<p>Have a question or comment? We'd love to hear from you! Use the form below to get in touch with us and we'll get back to you as soon as possible.</p>

<form @submit=${handlerSend}>

<label for="name">Name:</label><br>
<input type="text" id="name" name="name"><br><br>

<label for="email">Email:</label><br>
<input type="email" id="email" name="email"><br><br>

<label for="message">Message:</label><br>
<textarea id="message" name="message" rows="4" cols="50"></textarea><br><br>

<input type="submit" value="Send">

</form>
`
const root = document.getElementById('root');

export function contactView() {
    render(contactTemplate(), root);
}