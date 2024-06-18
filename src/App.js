import React, { useState, useEffect } from 'react'
import { CssBaseline, Grid } from '@material-ui/core'

import { getPlacesData } from './api/index'
import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'


const App = () => {
    const [places, setPlaces] = useState([])
    const [childClicked, setChildClicked] = useState(null)

    const [coordinates, setCoordinates] = useState({})
    const [bounds, setBounds] = useState({})
    const [isFetching, setIsFetching] = useState(false)


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) => {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, []) // should only run once, on page load since this is
           // the app component only added once to root div
           // and before the return statement for html elements

    useEffect(() => {
        const delay = 3000
        const timer = setTimeout(() => {
            if (!isFetching) {
                setIsFetching(true)
                getPlacesData(bounds.sw, bounds.ne)
                    .then((data) => {
                        setPlaces(data)
                        setIsFetching(false)
                    })
                    .catch((error) => {
                        console.error('Error fetching data: ', error)
                        setIsFetching(false)
                    })
            }
        }, delay)

        return () => clearTimeout(timer)
        
    }, [coordinates, bounds])

    return (
    <>
        <CssBaseline />
        <Header />
        <Grid container spacing={3} style={{ width: '100%' }}>
            <Grid item xs={12} md={4}>
                <List 
                    places={places} 
                    childClicked={childClicked}
                    isFetching={isFetching}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <Map 
                    setCoordinates={setCoordinates}
                    setBounds = {setBounds}
                    coordinates={coordinates}
                    places={places}
                    setIsFetching={setIsFetching}
                    setChildClicked={setChildClicked}
                />
            </Grid>
        </Grid>
    </>
    )
}

export default App