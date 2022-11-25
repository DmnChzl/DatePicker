import ReactDOM from 'react-dom/client';
import DatePicker from './components/DatePicker';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <DatePicker customMessages={{ 'Footer.Today': "Aujourd'hui", 'Footer.Cancel': 'Annuler' }}>
      {props => (
        <input
          ref={props.ref}
          type="date"
          defaultValue="2015-11-16"
          onClick={e => {
            e.preventDefault();
            props.onOpen();
          }}
        />
      )}
    </DatePicker>

    <DatePicker dayOfTheWeek={1} forceLocale="es" color="#fedbd0" bgColor="#442c2e" hideFooter>
      {props => (
        <input
          ref={props.ref}
          type="date"
          defaultValue="1993-05-21"
          onClick={e => {
            e.preventDefault();
            props.onOpen();
          }}
        />
      )}
    </DatePicker>

    <DatePicker dayOfTheWeek={1} color="#356859" bgColor="#fffbe6">
      {props => (
        <input
          ref={props.ref}
          type="date"
          defaultValue="2015-11-16"
          onClick={e => {
            e.preventDefault();
            props.onOpen();
          }}
        />
      )}
    </DatePicker>

    <DatePicker forceLocale="ja" color="#ffc107" bgColor="#171717" hideFooter>
      {props => (
        <input
          ref={props.ref}
          type="date"
          defaultValue="1993-05-21"
          onClick={e => {
            e.preventDefault();
            props.onOpen();
          }}
        />
      )}
    </DatePicker>
  </div>
);
