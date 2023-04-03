import { html, render } from '../../node_modules/lit-html/lit-html.js';

const root = document.querySelector('.container');

const myFurnitureTemplate = () => html`
<div class="row space-top">
<div class="col-md-12">
    <h1>My Furniture</h1>
    <p>This is a list of your publications.</p>
</div>
</div>
<div class="row space-top">
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
                <img src="./images/table.png" />
                <p>Description here</p>
                <footer>
                    <p>Price: <span>235 $</span></p>
                </footer>
                <div>
                    <a href="/details" class="btn btn-info">Details</a>
                </div>
        </div>
    </div>
</div>
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
                <img src="./images/sofa.jpg" />
                <p>Description here</p>
                <footer>
                    <p>Price: <span>1200 $</span></p>
                </footer>
                <div>
                    <a href="/details" class="btn btn-info">Details</a>
                </div>
        </div>
    </div>
</div>
</div>
`
export function myFurnitureView(){
    render(myFurnitureTemplate(), root);
}