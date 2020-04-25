String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

let country = {}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const search = getParameterByName('search')


if (!search) {
    $('#countryname').text("Worldwide")
    getCountry('all')
}
else {
    getCountry(search)
}


async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1e15972df8mshbd617b9f4faa36dp1d822ajsnc840e155ffc4'
        }
    })
    return response.json()
}


getData('https://covid-193.p.rapidapi.com/countries')
    .then(data => {
        country = data['response']

        $('#search').on('keyup', e => {
            if (e.keyCode === 13)
                render($('#search').val())

            $('.collection').empty();
            countries = country.filter(coun => coun.toUpperCase().indexOf($('#search').val().toUpperCase()) != -1)
            if (countries.length > 0)
                $(".collection").css('display', 'block')
            else
                $(".collection").css('display', 'none')
            countries.map(coun => {
                // $('.collection').append(`<a id="tag" onclick="document.getElementById('search').value = this.innerHTML;document.getElementById('search').focus()" class="collection-item">${coun}</a>`)
                $('.collection').append(`<a href="${window.location.href.split('?')[0]}?search=${coun}" id="tag" class="collection-item">${coun}</a>`)

            })

            if ($('#search').val() === '') {
                $('.collection').empty();
                $(".collection").css('display', 'none')
            }
        })

        function render(country) {
            var url = window.location.href.split('?')[0] + "?search=" + country;
            window.location.replace(url)
        }

    })


function getCountry(countryname) {
    $('#search').focus()


    fetch(`https://covid-193.p.rapidapi.com/statistics?country=${countryname}`, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1e15972df8mshbd617b9f4faa36dp1d822ajsnc840e155ffc4'
        }

    })
        .then(data => data.json())
        .then(result => {

            if (countryname != 'all') {
                $('#countryname').text(countryname.capitalize())
            }
            else {
                $('#countryname').text('Worldwide')
            }

            data = result['response']
            let total = data[0].cases.total
            let newcase = data[0].cases.new ? data[0].cases.new : "-"
            let active = data[0].cases.active
            let critical = data[0].cases.critical ? data[0].cases.critical : "-"
            let allcurrent = 0
            if(newcase != "-")
            allcurrent = parseInt(newcase) + parseInt(active)
            else
            allcurrent = parseInt(active)

            let recovered = data[0].cases.recovered
            let death = data[0].deaths.total ? data[0].deaths.total : "-"
            let newdeath = data[0].deaths.new ? data[0].deaths.new : "-"
            let test = data[0].tests.total ? data[0].tests.total : "-"
            let deathpernum = Math.ceil((death / total) * 100)
            deathpernum = deathpernum + "%"
            let recoverpernum = Math.ceil((recovered / total) * 100)
            recoverpernum = recoverpernum + "%"

            $('#totalnum').text(total)
            $('#newnum').text(newcase)
            $('#activenum').text(active)
            $('#criticalnum').text(critical)
            $('#currentnum').text(allcurrent)
            $('#recoverednum').text(recovered)
            $('#deathnum').text(death)
            $('#newdeathnum').text(newdeath)
            $('#testnum').text(test)
            $('#deathpernum').text(deathpernum)
            $('#recoverpernum').text(recoverpernum)
            $('#deathpernum').css('color', 'red')
            $('#recoverpernum').css('color', 'yellowgreen')

            countUp()
        })
        .catch(() => {
            $('#title').text("The country's name seem not correct. Try again!")
        })
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}



function countUp() {
    $('.count').each(function () {
        if($(this).text() != '-'){
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
                $(this).text(formatNumber($(this).text()))
            }
        });
    }
    });


}

