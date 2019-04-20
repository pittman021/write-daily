
window.onload = function() {

    // vars
    var goal = 250;
    var textArea = document.querySelector('#textArea');
    var count = document.querySelector('#count');
    var wordGoal = document.querySelector('#word-goal');
    var saveStatus = document.querySelector('#save-status');
    var todaysDate = document.querySelector('#todays-date');
    var monthDates = document.querySelector('#month-dates');
    var timeoutId;
    var save = true;

    var tx = document.getElementsByTagName('textarea');

    for (var i = 0; i < tx.length; i++) {
    tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
    tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    }

    
    // Helper Functions
    //
    function WordCount(str) {
        return str.split(' ')
        .filter(function(n) { return n != '' })
        .length;
    }

    function updateCount() {
        var text = textArea.value;
        var wordCount = WordCount(text);
        count.innerHTML = WordCount(text);
        successCheck(wordCount);
    }
    //
    // Event Listeners
    // 
    textArea.addEventListener('keyup', function(e) {
        
        if(e.keyCode === 32) {
            updateCount();

            if (timeoutId) clearTimeout(timeoutId);
        
            // Set timer that will save comment when it fires.
            timeoutId = setTimeout(saveDraftToStorage, 3000);
        }
    });
    
    // jessus can you clean this up?
    monthDates.addEventListener('click', function(e) {
        var d = e.target.dataset.day;
        var m = new Date().getMonth();
        var today = new Date(new Date().toDateString()).toString();
        var date = new Date(new Date(2019,m,d).toDateString()).toString();
        var data = JSON.parse(localStorage.getItem('drafts'));
        var pos = data.map(function(e) { return e.date; }).indexOf(date);
        textArea.value = data[pos].draft
        if(date !== today) save = false;
        if(date === today) save = true; 
        updateCount();
    });

    function successCheck(wordCount) {
        if(wordCount < goal) {
            count.classList.remove('success');
        } else {
            count.classList.add('success');
        }
    }

    function setInitialContent() {
        var date = new Date(new Date().toDateString()).toString();
        var data = JSON.parse(localStorage.getItem('drafts'));
        var arr = [];
        var obj = { 
            draft: "",
            date: date
        }
        // setup new localStorage object for a new session.
        arr.push(obj);

        // if there's no saved drafts in session, create a new one & display it. 
        if (!data) {
            textArea.value = "Get started writing!";
            localStorage.setItem('drafts', JSON.stringify(arr))
        
        // if there's data saved, find today's record. If no record for today, setup new one. 
        } else {
            var pos = data.map(function(e) { return e.date; }).indexOf(date);

            // if no post for today. tis a new day! 
            if(pos === -1) {
                data.push(obj);
                localStorage.setItem('drafts', JSON.stringify(data));
                textArea.value = "Today is a new day! Start writing =)";
            } else {
            // if there is today's post. show it in textArea // 
            textArea.value = data[pos].draft
            textArea.dispatchEvent(new Event('change'));

            }


        }
    }

    function saveDraftToStorage(text) {
        var data = JSON.parse(localStorage.getItem('drafts'));
        var date = new Date(new Date().toDateString()).toString();

        // check whether save var is true, which is set when date is today. cant save old posts // 
        if(save) {

        // there should always be a draft
            var pos = data.map(function(e) { return e.date; }).indexOf(date);
            
            // if date is not found. push new record for that date // 
            if(pos === -1) {
                var obj = {
                    draft: text,
                    date: date
                }
                data.push(obj);
                localStorage.setItem('drafts', JSON.stringify(data));
                saveStatus.innerHTML = 'post saved';
                    setTimeout(function() {
                        saveStatus.innerHTML = '';
                    }, 2000)
                
                // update draft if date already exist // 
                } else {
                    data[pos].draft = text
                    localStorage.setItem('drafts', JSON.stringify(data))
                    saveStatus.innerHTML = 'post saved';
                    setTimeout(function() {
                        saveStatus.innerHTML = '';
                    }, 2000)
                }

        }
    }        


    // setup
    function buildButtonList() {
        var days = daysInMonth( moment().month() );
        days.forEach(function(day,key) {
            var dayMonth = key + 1;
           // get the month 
            var m = new Date().getMonth();
            var date = new Date(new Date(2019,m,dayMonth).toDateString()).toString();
            var data = JSON.parse(localStorage.getItem('drafts'));
            if(!data) {
              addDateButton(day,dayMonth, true);
              
            } else {
              var pos = data.map(function(e) { return e.date; }).indexOf(date);
              if(pos === -1) {
                  addDateButton(day,dayMonth, true)
                } else {
                    addDateButton(day,dayMonth, false);
                }
            }
        });
    }

      // set days or whatever // 
      function addDateButton(buttonText, day, disabled) {
            // create the button 
            var p = document.createElement('button');   
            var t = document.createTextNode(buttonText);
            p.setAttribute('data-day', day)
            p.disabled = true;
            p.appendChild(t);
            monthDates.appendChild(p);
            p.disabled = disabled;
      }

    function daysInMonth(month) {
        var count =  moment().month(month).daysInMonth();
        var days = [];
        for (var i = 1; i < count+1; i++) {
          days.push(moment().month(month).date(i).format('M-D'));
        }
        return days;
      }

      function init() {
        // populate textArea with today's post or blank slate. 
        setInitialContent();
        // check localStorage & build this month's list of writing to review. 
        buildButtonList(); 
        // update counter
        count.innerHTML = WordCount(textArea.value);
        // set today's date
        todaysDate.innerHTML = moment().format('MMMM Do, YYYY');
      }

      init();
}

