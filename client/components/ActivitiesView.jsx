import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Button from "react-bootstrap/Button";
// import { post } from "../../server/routes/news";

const ActivitiesCards = ({ activities, addFav, deleteFav, isLoggedIn, favoriteActivities }) => {
  // console.log('ACTIVITIES:', activities, favoriteActivities);
  if (!activities || !favoriteActivities) return null;

  const activitiesCards = activities.map((businessInfo, i) => (
    <Card key={`activities-card-${i}`} className={"activity-card"}>
      <div className="card-img-container">
        <Card.Img
          className="card-img"
          variant="top"
          src={businessInfo.image_url}
        />
      </div>
      <Card.Body>
        <Card.Title>{businessInfo.name}</Card.Title>
        <Card.Text>Rating: {businessInfo.rating}</Card.Text>
        <Card.Text>Reviews: {businessInfo.review}</Card.Text>
        <Card.Text>Location: {businessInfo.location.address1}</Card.Text>
        {isLoggedIn &&
          (!favoriteActivities.includes(businessInfo) ? (
            <Button
              className="cardButton"
              onClick={() => {
                addFav(businessInfo);
              }}
            >
              Add to Favorites
            </Button>
          ) : (
            <Button
              className="cardButton"
              onClick={() => {
                deleteFav(businessInfo.id);
              }}
            >
              Delete from Favorites
            </Button>
          ))}
      </Card.Body>
    </Card>
  ));

  return (
    <div className="cards-container">
      <CardDeck>{activitiesCards}</CardDeck>
    </div>
  );
};


const mapStateToProps = ({
  informationReducer: { lat, long, countryCode },
}) => ({ lat, long, countryCode });

const ActivitiesView = (props) => {
  const { isLoggedIn, setIsLoggedIn } = props;
  const [fetchedData, setFetchedData] = useState(false);
  const [currentActivities, setCurrentActivities] = useState([]); // DISCUSS
  const [favoriteActivities, setFavoriteActivities] = useState([]);

  const countryCode = "US";
  const DEFAULT_IMG =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80";

  const fetchData = (category = "bars") => {
    fetch(`/businesses/${category}?lat=${props.lat}&lon=${props.long}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/JSON",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFetchedData(true);
        console.log("ACTIVITIES FETCHED", data);
        setCurrentActivities(data);
      })
      .catch((err) => console.log("Activities fetch ERROR: ", err));
  };

  const changeCategory = (category) => {
    return () => fetchData(category);
  };

  const addFav = (info) => {
    const token = localStorage.token;
    fetch("/favorites/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(info),
    })
      .then((res) => res.json())
      .then((response) => {
        if (!response.isLoggedIn) {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => console.log("getting favorites from db error: ", err));
      
      const newFavs = favoriteActivities.slice();
      if (!newFavs.includes(info)) {
        newFavs.push(info);
        setFavoriteActivities(newFavs);
      }
  };

  const deleteFav = (businessId) => {
    const token = localStorage.token;
    fetch("/favorites/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify({ id: businessId }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (!response.isLoggedIn) {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => console.log("getting favorites from db error: ", err));
    
    const newFavs = favoriteActivities.slice();
    for (let i = 0; i < newFavs.length; i++) {
      if (newFavs[i].id === businessId) {
        newFavs.splice(i, 1);
      }
    }
    setFavoriteActivities(newFavs);
  };

  useEffect(() => {
    if (!fetchedData) fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.city, isLoggedIn]);

  useEffect(() => {
    const token = localStorage.token;
    fetch("/favorites/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.isLoggedIn) {
          setIsLoggedIn(true);
          console.log("GET FAVORITES", response.favorites);
          if (response.favorites){
            setFavoriteActivities(response.favorites);
          }
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => console.log("getting favorites from db error: ", err));
  }, []);

  if (!fetchedData) {
    return <h1 id="title">Fetching from database</h1>;
  }
  
  const CATEGORIES = [
    "Restaurants",
    "Bars",
    "Climbing",
    "Health",
    "Bowling",
    "Fitness",
  ];

  const buttonsArray = [];
  for (let i = 0; i < CATEGORIES.length; i += 1) {
    buttonsArray.push(
      <Button
        key={`b${i}`}
        className="mx-1 my-3"
        variant="dark"
        onClick={changeCategory(CATEGORIES[i])}
        id={CATEGORIES[i]}
      >
        {CATEGORIES[i]}
      </Button>
    );
  }

  return (
    <div className="activities-container">
      {isLoggedIn && (
        <div>
          <h1 id="title">Favorites List</h1>
          <ActivitiesCards 
            activities={favoriteActivities}
            addFav={addFav}
            deleteFav={deleteFav}
            isLoggedIn={isLoggedIn}
            favoriteActivities={favoriteActivities}
          />
        </div>
      )}
      <h1 id="title">Local Activities Information</h1>
      <div className="activities-buttons">{buttonsArray}</div>
      <ActivitiesCards 
        activities={currentActivities}
        addFav={addFav}
        deleteFav={deleteFav}
        isLoggedIn={isLoggedIn}
        favoriteActivities={favoriteActivities}
      />
    </div>
  );

};

export default connect(mapStateToProps, null)(ActivitiesView);
