import React from 'react'
import classnames from 'classnames'
import { Spinner } from '../../components/Spinner'
import { useGetSoapMeteoStationsQuery } from '../api/apiSlice'
import { stationCoordinates } from '../../synopticDictionaries'
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps'

let Station = ({ station }) => {
  let s = `${station.index} ${station.name}`
  return (
    <article>
      <h3>{s}</h3>
    </article>
  )
}
export const StationsListSoap = ()=>{
  const {
    data: stations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetSoapMeteoStationsQuery()

  // Создаем кастомный макет для балуна с кнопкой
  // var MyBalloonLayout = YMaps.templateLayoutFactory.createClass(
  //   '<div class="my-balloon">' +
  //       '<b>{{properties.name}}</b><br/>' +
  //       '<button class="my-button" data-id="{{properties.id}}">Подробнее</button>' +
  //   '</div>', {
  //       build: function() {
  //           MyBalloonLayout.superclass.build.call(this);
  //           // Вешаем обработчик на кнопку
  //           $('.my-button').on('click', this.onButtonClick);
  //       },
  //       clear: function() {
  //           $('.my-button').off('click', this.onButtonClick);
  //           MyBalloonLayout.superclass.clear.call(this);
  //       },
  //       onButtonClick: function(e) {
  //           var id = $(this).data('id');
  //           alert('Клик по кнопке! ID: ' + id);
  //       }
  //   }
  // );
  let content
  const clusterPoints = []
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    const renderedStations = stations.meteostations.map((station) => 
      {clusterPoints.push(<Placemark 
        key={station.index} 
        defaultGeometry={stationCoordinates[station.index]} 
        properties={{
          iconContent: station.index,
          hintContent: station.name,
          balloonContentBody: `Это метка номер ${station.index}`,
          // balloonContent: `Это метка номер ${station.index}`,
        }} 
        modules = {
          ['geoObject.addon.hint','geoObject.addon.balloon']
        }
        options={{preset: "islands#grayStretchyIcon"}}
        // Используем instanceRef для доступа к внутреннему объекту
        instanceRef={(ref) => {
          if (ref) {
            ref.events.add('click', (e) => {
              const target = e.get('target');
              const id = target.properties.get('iconContent');
              target.properties.set('balloonContentBody', `${id} report_date: ${new Date().toLocaleString().replace('T',' ').slice(0,16)}0:00`)
              console.log('Клик! ID:', id);
              // if (ref.current) {
                // Принудительно открываем балун у этой метки
                // target.properties.set('balloonContentBody', 'Новый контент')
                // ref.current.balloon.open();
              // }
              
            });
          }
        }}
      />)
      return (<Station key={station.index} station={station} />)}
    )
    const containerClassname = classnames('stations-container', {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>
      {renderedStations}
      <YMaps query={{ apikey: process.env.REACT_APP_YANDEX_API_KEY }}>
        <Map
          defaultState={{
            center: [47.7, 38.0],
            zoom: 8,
            controls: ['zoomControl']
          }}
          width={600}
          height={600}
          modules={['control.ZoomControl']}
        >
          <Clusterer
            options={{
              groupByCoordinates: false,
            }}>{clusterPoints}</Clusterer>
        </Map>
      </YMaps>
    </div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
  return (
    <section>
      <h2>Метеостанции (SOAP)</h2>
      {content}
    </section>
  )
}