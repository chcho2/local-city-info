import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Button from "react-bootstrap/Button";
// import { post } from "../../server/routes/news";

const mapStateToProps = ({
  informationReducer: { lat, long, countryCode },
}) => ({ lat, long, countryCode });

const ActivitiesView = (props) => {
  const { isLoggedIn, setIsLoggedIn } = props;
  const [activitiesData, setActivitiesData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);
  const [currentActivities, setCurrentActivities] = useState([]); // DISCUSS
  const [favoriteActivities, setFavoriteActivities] = useState([]);

  const countryCode = "US";
  const DEFAULT_IMG =
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80";

  const createActivities = (listOfBusinesses) => {
    return listOfBusinesses.map((businessInfo, i) => {
      // console.log("businessInfo: ", businessInfo);
      return (
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
      );
    });
  };

  const fetchData = (category = "bars") => {
    fetch(`/businesses/${category}?lat=${props.lat}&lon=${props.long}`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/JSON",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setActivitiesData(data);
        setFetchedData(true);
        setCurrentActivities(createActivities(data));
      })
      .catch((err) => console.log("Activities fetch ERROR: ", err));
  };

  const changeCategory = (category) => {
    return () => fetchData(category);
    // setCurrentActivities(createActivities(activitiesData, category)); // DISCUSS
  };

  const addFav = (info) => {
    // fetch("/favorties/", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    console.log("hello");
    if (!favoriteActivities.includes(info)) {
      favoriteActivities.push(info);
      setFavoriteActivities(createActivities(favoriteActivities));
    }
    // });
  };

  const deleteFav = (businessId) => {
    console.log("businessId: ", businessId);
    for (let i = 0; i < favoriteActivities.length; i++) {
      if (favoriteActivities[i].id === businessId) {
        favoriteActivities.splice(i, 1);
      }
    }
    setFavoriteActivities(createActivities(favoriteActivities));
  };

  useEffect(() => {
    if (!fetchedData) fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [props.city, isLoggedIn]);

  useEffect(() => {
    fetch("/favorites/")
      .then((res) => res.json())
      .then((response) => {
        if (response.isLoggedIn) {
          setIsLoggedIn(true);
          setFavoriteActivities(response.favorites);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => console.log("getting favorites from db error: ", err));
  });

  if (!activitiesData) return null;

  if (fetchedData) {
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
            <div className="cards-container">
              <CardDeck>{favoriteActivities}</CardDeck>
            </div>
          </div>
        )}
        <h1 id="title">Local Activities Information</h1>
        <div className="activities-buttons">{buttonsArray}</div>
        <div className="cards-container">
          <CardDeck>{currentActivities}</CardDeck>
        </div>
      </div>
    );
  } else {
    return <h1 id="title">Fetching from database</h1>;
  }
};

export default connect(mapStateToProps, null)(ActivitiesView);
