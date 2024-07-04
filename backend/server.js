const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const PORT = process.env.PORT || 5000;

const app = express();
const flights = require('./flights.json');

app.use(bodyParser.json());
app.use(cors());

app.get('/api/flights', (req, res) => {
  const { source, destination, date, guests } = req.query;
  const { adults, children } = JSON.parse(guests);
  const totalPassengers = parseInt(adults) + parseInt(children);
  const availableFlights = flights.filter(flight =>
    flight.source.toLowerCase().includes(source.toLowerCase()) &&
    flight.destination.toLowerCase().includes(destination.toLowerCase()) &&
    flight.departure_date >= date &&
    flight.availableSeats >= totalPassengers
  );
  res.json(availableFlights);
});

app.post('/api/confirm', (req, res) => {
  const { flightId, adults, children } = req.body;
  const totalPassengers = parseInt(adults) + parseInt(children);
  const flight = flights.find(f => f.id == flightId);

  if (flight && flight.availableSeats >= totalPassengers) {
    flight.availableSeats -= totalPassengers;
    res.json({ success: true, message: 'Flight confirmed!' });
  } else {
    res.json({ success: false, message: 'Not enough seats available.' });
  }
});

app.post('/api/download-ticket', (req, res) => {
  const { flightId, numberOfAdults, numberOfChilds, passengersDetails } = req.body;
  const passengersDetail = JSON.parse(passengersDetails);
  const flight = flights.find(f => f.id == flightId);
  if (!flight) {
    return res.status(404).send('Flight not found');
  }

  if (passengersDetail) {
    const email = passengersDetail.email;
    const contactNumber = passengersDetail.contactNumber;
    const adults = passengersDetail.adults;
    const childs = passengersDetail.childs;
    console.log(numberOfChilds)
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfData),
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment;filename=ticket.pdf`,
        })
        .end(pdfData);
    });

    doc.fontSize(25).text('Flight Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`Email: ${email}`);
    doc.fontSize(18).text(`Mobile Number: ${contactNumber}`);
    doc.text(`Flight from ${flight.source} to ${flight.destination}`);
    doc.text(`Date: ${flight.departure_date}`);
    doc.text(`Time: ${flight.time}`);
    doc.text(`Duration: ${flight.duration}`);
    doc.text(`Adults: ${numberOfAdults}, Children: ${numberOfChilds}`);
    adults.forEach((adult, index) => {
      doc.text(`Adult ${index + 1}: ${adult.firstName} ${adult.lastName}, Gender: ${adult.gender}`);
    });
    if(numberOfChilds > 0)
    {
      childs.forEach((child, index) => {
        doc.text(`Child ${index + 1}: ${child.firstName} ${child.lastName}, Gender: ${child.gender}`);
      });
    }
    doc.text(`Total Price: $${flight.price * (numberOfAdults + numberOfChilds)}`);
    doc.end();
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));