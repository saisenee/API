const apiUrl = 'https://corsproxy.io/?https://myttc.ca/union_station.json';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const timetableDiv = document.getElementById('timetable');
    timetableDiv.innerHTML = '';

    if (!data.stops || data.stops.length === 0) {
      timetableDiv.textContent = 'No timetable data available.';
      timetableDiv.style.color = 'red';
      return;
    }

    data.stops.forEach(stop => {
      if (stop.routes && stop.routes.length > 0) {
        const stopTitle = document.createElement('h2');
        stopTitle.textContent = stop.name;
        timetableDiv.appendChild(stopTitle);

        stop.routes.forEach(route => {
          const routeTitle = document.createElement('h3');
          routeTitle.textContent = route.name;
          timetableDiv.appendChild(routeTitle);

          //Local time formatting made with help from chatbot
          const ul = document.createElement('ul');
          route.stop_times.forEach(time => {
            const li = document.createElement('li');
            // Convert GMT timestamp to EST (Eastern Time, UTC-5 or UTC-4 for DST)
            const gmtDate = new Date(time.departure_timestamp * 1000);
            // Use Intl.DateTimeFormat for America/Toronto (EST/EDT)
            const estTime = gmtDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              timeZone: 'America/Toronto'
            });
            li.textContent = `${estTime} (local) / ${time.departure_time} (API) - ${time.shape}`;
            ul.appendChild(li);
            ul.appendChild(document.createElement('br'));
          });
          timetableDiv.appendChild(ul);
        });
      }
    });
  })
  .catch(error => {
    console.error('Error fetching timetable:', error);
    const timetableDiv = document.getElementById('timetable');
    timetableDiv.textContent = 'Failed to load timetable.';
    timetableDiv.style.color = 'red';
  });