function attachEvents() {

    document.getElementById('submit').addEventListener('click', () => {
        const urlLocations = `http://localhost:3030/jsonstore/forecaster/locations`;
        fetch(urlLocations)
            .then(res => res.json())
            .then(result => {

                let inputElement = document.getElementById('location');
                let foundObject = result.find(obj => obj.name == inputElement.value);
                const urlForecasterToday = `http://localhost:3030/jsonstore/forecaster/today/${foundObject.code}`;
                const urlForecasterUpcomingdays = `http://localhost:3030/jsonstore/forecaster/upcoming/${foundObject.code}`;

                fetch(urlForecasterToday)
                    .then(res => res.json())
                    .then(result => {

                        //current conditions: 
                        let divElement = document.createElement('div');
                        divElement.classList.add('forecasts');

                        let spanElementConditionSymbol = document.createElement('span');
                        spanElementConditionSymbol.classList.add('condition');
                        spanElementConditionSymbol.classList.add('symbol');

                        switch (result['forecast'].condition) {
                            case 'Sunny':
                                spanElementConditionSymbol.innerHTML = '&#x2600';
                                break;

                            case 'Rain':
                                spanElementConditionSymbol.innerHTML = '&#x2614';

                                break;
                        }

                        let spanElementCondition = document.createElement('span');
                        spanElementCondition.classList.add('condition');

                        let firstSpanElementForecast = document.createElement('span');
                        firstSpanElementForecast.textContent = result['name'];
                        firstSpanElementForecast.classList.add('forecast-data');

                        let secondSpanElementForecast = document.createElement('span');
                        secondSpanElementForecast.innerHTML = `${result['forecast'].low}&#176/${result['forecast'].high}&#176`;
                        secondSpanElementForecast.classList.add('forecast-data');


                        let thirdSpanElementForecast = document.createElement('span');
                        thirdSpanElementForecast.innerHTML = result['forecast'].condition;
                        thirdSpanElementForecast.classList.add('forecast-data');


                        divElement.appendChild(spanElementConditionSymbol);
                        spanElementCondition.appendChild(firstSpanElementForecast);
                        spanElementCondition.appendChild(secondSpanElementForecast);
                        spanElementCondition.appendChild(thirdSpanElementForecast);
                        divElement.appendChild(spanElementCondition);

                        document.getElementById('current').appendChild(divElement);
                        document.getElementById('forecast').style.display = 'block';

                        if (document.querySelectorAll('.forecasts').length > 1) {
                            document.querySelectorAll('.forecasts')[0].remove();
                        }

                    })
                    .catch(err => console.log(err))

                fetch(urlForecasterUpcomingdays)
                    .then(res => res.json())
                    .then(result => {

                        //3-days conditions: 
                        let divElement = document.createElement('div');
                        divElement.classList.add('forecast-info');

                        for (const info of result['forecast']) {

                            let spanElement = document.createElement('span');
                            spanElement.classList.add('upcoming');

                            let spanSymbolElement = document.createElement('span');
                            spanSymbolElement.classList.add('symbol');
                            switch (info.condition) {
                                case 'Sunny':
                                    spanSymbolElement.innerHTML = '&#x2600';
                                    break;
                                case 'Partly sunny':
                                    spanSymbolElement.innerHTML = '&#x26C5';
                                    break;
                                case 'Overcast':
                                    spanSymbolElement.innerHTML = '&#x2601';
                                    break;
                                case 'Rain':
                                    spanSymbolElement.innerHTML = '&#x2614';
                                    break;

                            }
                            let spanTemperatureElement = document.createElement('span');
                            spanTemperatureElement.classList.add('forecast-data');
                            spanTemperatureElement.innerHTML = `${info.low}&#176/${info.high}&#176`

                            let spanConditionElement = document.createElement('span');
                            spanConditionElement.classList.add('forecast-data');
                            spanConditionElement.innerHTML = `${info.condition}`;

                            spanElement.appendChild(spanSymbolElement);
                            spanElement.appendChild(spanTemperatureElement);
                            spanElement.appendChild(spanConditionElement);
                            divElement.appendChild(spanElement);

                        }

                        document.getElementById('upcoming').appendChild(divElement);
                        if (document.querySelectorAll('.forecast-info').length > 1) {
                            document.querySelectorAll('.forecast-info')[0].remove();
                        }

                    })
                    .catch(() => {
                        console.error('Error');

                    })

            })
            .catch(() => {
                console.error('Error');
            });
    })

}

attachEvents();