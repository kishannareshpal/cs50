
## API
### Endpoint Overview
- [POST /api/login](#login) - Authenticate

- [POST /api/register](#register) - Create an account

- [POST /api/logout](#logout) - Logout

- [GET /api/users](#users) - A user by email

  

- [GET /api/services](#services) - Get all services

- [GET /api/businesshours](#businesshours) - Get the business hours

- [GET /api/barbers](#barbers) - Get all barbers

- [( GET | POST ) /api/bookings](#bookings) - All bookings / Create a booking

- [POST /api/bookings/update](#update-bookings) - Update a booking

- [GET /api/profile/bookings](#profile-bookings) - My bookings


----
#### [Login](#login)
Authenticate a user via email and password

###### REQUEST
`POST /api/login`

###### QUERY PARAMS
NONE

###### BODY
```swift
{
  email: String,
  password: String
}
```

###### SUCCESS RESPONSE
```swift
200 OK
Content-Type: "application/json"

{
  message: "Logged in",
  data: {
    id: 1,
    fullname: "Kishan Jadav",
    email: "kishan@gato.co.uk",
    is_staff: true  
  }
}
```

###### ERROR RESPONSE
```swift
405 METHOD NOT ALLOWED
Content-Type: "application/json"

{
  message: "POST request required",
  data: null
}
```

```swift
404 NOT FOUND
Content-Type: "application/json"

{
  message: "Invalid credentials",
  data: null
}
```

###### SAMPLE CALL
```javascript
// Login a user
fetch('/api/login', {
    method: "POST",
    body: JSON.stringify({
        email: "kishan@gato.co.uk",
        password: "shHth1s1s4s3cr3t",
    })
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```


<br>


#### [Register](#register)
Register a user with their name, email and password.

###### REQUEST
`POST /api/register`

###### QUERY PARAMS
NONE

###### BODY
```swift
{
  first_name: String,
  last_name: String,
  email: String,
  password: String
}
```

###### SUCCESS RESPONSE
```swift
200 OK
Content-Type: "application/json"

{
  message: "Registered & Logged in",
  data: {
    id: 1,
    fullname: "Kishan Jadav",
    email: "kishan@gato.co.uk",
    is_staff: true  
  }
}
```

###### ERROR RESPONSE
```swift
403 FORBIDDEN
Content-Type: "application/json"

{
  message: "Email already registered",
  data: null
}
```

```swift
405 METHOD NOT ALLOWED
Content-Type: "application/json"

{
  message: "POST request required",
  data: null
}
```

###### SAMPLE CALL
```javascript
// Register a new user
fetch('/api/register', {
    method: "POST",
    body: JSON.stringify({
        first_name: "Kishan",
        last_name: "Jadav",
        email: "kishan@gato.co.uk",
        password: "shHth1s1s4s3cr3t",
    })
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```


<br>


#### [Logout](#logout)
Logout the current user session

###### REQUEST
`POST /api/logout`

###### QUERY PARAMS
`None`

###### BODY
`None`

###### SUCCESS RESPONSE
```swift
200 OK
Content-Type: "application/json"

{
  message: "Logged out",
  data: null
}
```

###### ERROR RESPONSE
`None`

###### SAMPLE CALL
```javascript
// Logout the current user
fetch('/api/logout', {
    method: "POST"
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



<br>



#### [Users](#users)
Get a user by it's email

###### REQUEST
`GET /api/users`

###### QUERY PARAMS
| Key   | Value type | Required |
| ---   | ---        | ---      |
| email | `String`   | 👍       |


###### BODY
`None`

###### SUCCESS RESPONSE
```swift
200 OK
Content-Type: "application/json"

{
  message: null,
  data: {
    id: 1,
    fullname: "Kishan Jadav",
    email: "kishan@gato.co.uk",
    is_staff: true  
  }
}
```

###### ERROR RESPONSE
```swift
404 NOT FOUND
Content-Type: "application/json"

{
  message: "User not found",
  data: null
}
```

```swift
400 BAD REQUEST
Content-Type: "application/json"

{
  message: "Invalid request. Email param is required",
  data: null
}
```

###### SAMPLE CALL
```javascript
// Register a new user
const param = new URLSearchParam({
  email: "kishan_jadav@hotmail.com"
}).toString()

fetch(`/api/user?${param}`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



<br>



#### [Services](#services)
Get a list of services of this shop, grouped by type.

###### REQUEST
`GET /api/services`

###### QUERY PARAMS
`None`

###### BODY
`None`

###### SUCCESS RESPONSE
```swift
200 OK
Content-Type: "application/json"

{
  message: null,
  meta: {
    count: 1
  },
  data: [{
    {
      type: "Facial Treatments",
      services: [
        {
          id: 14,
          type: {
            id: 2,
            title: "Facial Treatments"
          }
        },
        ...
      ]
    }
  }, ...]
}
```

###### ERROR RESPONSE
```swift
405 METHOD NOT ALLOWED
Content-Type: "application/json"

{
  message: "GET request required",
  data: null
}
```

###### SAMPLE CALL
```javascript
// Get a list of services
fetch(`/api/services`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



<br>




#### [BusinessHours](#businesshours)
Get business hours of this shop.

###### REQUEST
`GET /api/businesshours`

###### QUERY PARAMS
`None`

###### BODY
`None`

###### SUCCESS RESPONSE
```swift
200 OK
Content-Type: "application/json"

{
  message: null,
  data: [
    {
      "id": 2,
      "day": 1,
      "day_name": "Monday",
      "opening_time": "10:00",
      "closing_time": "18:00"
    },
    ...
  ]
}
```

###### ERROR RESPONSE
```swift
405 METHOD NOT ALLOWED
Content-Type: "application/json"

{
  message: "GET request required",
  data: null
}
```

###### SAMPLE CALL
```javascript
// Get business hours
fetch(`/api/businesshours`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



<br>



#### [Barbers](#barbers)
Get a list of staff working on this shop

###### REQUEST
`GET /api/barbers`

###### QUERY PARAMS
`None`

###### BODY
`None`

###### SUCCESS RESPONSE
```swift
200 OK
Content-Type: "application/json"

{
  message: null,
  data: [
    {
      id: 26,
      fullname: "Gustavo Lima",
      photo_url: "/media/staff/gustavo_lima_y7FRWIx.png",
      email: "glima@gato.co.uk",
      is_barber: true,
      is_staff: true
    },
    ...
  ]
}
```

###### ERROR RESPONSE
```swift
405 METHOD NOT ALLOWED
Content-Type: "application/json"

{
  message: "GET request required",
  data: null
}
```

###### SAMPLE CALL
```javascript
// Get all staffs
fetch(`/api/barbers`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



<br>



#### [Bookings](#bookings)
`GET`: Get a list of all bookings<br>

> If `barber_id` param is provided, returns a list of bookings due to that day only.

> If `barber_id` param is provided, returns a list of bookings with only that barber.

> If `search_query` param is provided, returns a list of bookings matching the query on either one of these:
>  - booking number
>  - barber's first name
>  - barber's last name
>  - service title
>  - service type
>  - service description
>  - booking note

`POST`: Create a new booking.

###### REQUESTS
`GET /api/bookings`<br>
`POST /api/bookings`


###### QUERY PARAMS
For `GET` request only.<br>
You can mix the query params.

| Key          | Value type | Required |
| ---          | ---        | ---      |
| barber_id    | `String`   | 👎       |
| date         | `String` (format "DD/MM/YYYY")   | 👎       |
| search_query | `String`   | 👎       |


###### BODY
For `POST` request only.<br>
```swift
{
  service_id: Number|String,
  barber_id: Number|String,
  note: String,
  date: String, // format "DD/MM/YYYY"
  time: String, // format "HH:mm"
}
```

###### SUCCESS RESPONSES
On `POST`:
```swift
201 CREATED
Content-Type: "application/json"

{
  message: "Booked",
  data: {
    id: 1,
    user: {
      id: 2,
      fullname: "Stelio Braga",
      email: "stelio@braga.com",
      is_staff: false
    },
    "barber": {
      id: 4,
      name: "David Barbosa",
      photo_url: "http://localhost:8000/media/staff/david_barbosa.jpg",
      description: null
    },
    service: {
      id: 14,
      type: {
        id: 2,
        title: "Facial Treatments"
      },
      title: "Full Face Black Mask Facial",
      description: "Steam, Cleanse, Mask, Tone & Moisturise",
      price_in_gbp: "15.00",
      duration_in_mins: 40
    },
    number: "c2bfbdcc-8e77-4d8a-b776-ff7ab44de3ca",
    date: "04/01/2021", // DD/MM/YYYY
    time: "17:00", // HH:mm
    status: "accepted",
    note: null,
    timestamp: "8:13 AM · Jan 3, 2021"
  }
}
```

On `GET`:
```swift
200 OK
Content-Type: "application/json"

{
  message: null,
  data: [
    {
      id: 1,
      user: {
        id: 2,
        fullname: "Stelio Braga",
        email: "stelio@braga.com",
        is_staff: false
      },
      "barber": {
        id: 4,
        name: "David Barbosa",
        photo_url: "http://localhost:8000/media/staff/david_barbosa.jpg",
        description: null
      },
      service: {
        id: 14,
        type: {
          id: 2,
          title: "Facial Treatments"
        },
        title: "Full Face Black Mask Facial",
        description: "Steam, Cleanse, Mask, Tone & Moisturise",
        price_in_gbp: "15.00",
        duration_in_mins: 40
      },
      number: "c2bfbdcc-8e77-4d8a-b776-ff7ab44de3ca",
      date: "04/01/2021", // DD/MM/YYYY
      time: "17:00", // HH:mm
      status: "accepted",
      note: null,
      timestamp: "8:13 AM · Jan 3, 2021"
    },
    ...
  ]
}
```

###### ERROR RESPONSES
```swift
401 UNAUTHORIZED
Content-Type: "application/json"

{
  message: "Unauthorized",
  data: null
}
```

```swift
404 NOT FOUND
Content-Type: "application/json"

{
  message: "Service or Barber not found",
  data: null
}
```

```swift
400 BAD REQUEST
Content-Type: "application/json"

{
  message: "Invalid date or time format. Please use DD/MM/YYYY for date and HH:mm for time",
  data: null
}
```


###### SAMPLE CALL
```javascript
// ––––––––––––––––––
// Get all bookings
// ––––––––––––––––––
fetch(`/api/bookings`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });


// ––––––––––––––––––
// Get all bookings on a specific date
// ––––––––––––––––––
const params = new URLSearchParams({
  date: "04/01/2021"
})
fetch(`/api/bookings?#${params}`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });


// ––––––––––––––––––
// Book an appointment
// ––––––––––––––––––
fetch('/api/bookings', {
    method: "POST",
    body: JSON.stringify({
      service_id: 4,
      barber_id: 2,
      note: "For my son. He will come alone with the booking #",
      date: "06/01/2021",
      time: "14:30",
    })
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });

```



<br>



#### [Profile Bookings](#profile-bookings)
Get only bookings made by the currently logged in user. 

If `search_query` param is provided, returns a list of bookings matching the query on either one of these:
  - booking number
  - barber's first name
  - barber's last name
  - service title
  - service type
  - service description
  - booking note


###### REQUEST
`GET /api/profile/bookings`


###### QUERY PARAMS
| Key          | Value type | Required |
| ---          | ---        | ---      |
| search_query | `String`   | 👎       |


###### BODY
`None`

###### SUCCESS RESPONSES
```swift
200 OK
Content-Type: "application/json"

{
  message: null,
  data: [
    {
      id: 1,
      user: {
        id: 2,
        fullname: "Stelio Braga",
        email: "stelio@braga.com",
        is_staff: false
      },
      "barber": {
        id: 4,
        name: "David Barbosa",
        photo_url: "http://localhost:8000/media/staff/david_barbosa.jpg",
        description: null
      },
      service: {
        id: 14,
        type: {
          id: 2,
          title: "Facial Treatments"
        },
        title: "Full Face Black Mask Facial",
        description: "Steam, Cleanse, Mask, Tone & Moisturise",
        price_in_gbp: "15.00",
        duration_in_mins: 40
      },
      number: "c2bfbdcc-8e77-4d8a-b776-ff7ab44de3ca",
      date: "04/01/2021", // DD/MM/YYYY
      time: "17:00", // HH:mm
      status: "accepted",
      note: null,
      timestamp: "8:13 AM · Jan 3, 2021"
    },
    ...
  ]
}
```

###### ERROR RESPONSES
```swift
405 METHOD NOT ALLOWED
Content-Type: "application/json"

{
  message: "GET request required",
  data: null
}
```

```swift
401 UNAUTHORIZED
Content-Type: "application/json"

{
  message: "Unauthorized",
  data: null
}
```


###### SAMPLE CALL
```javascript
// ––––––––––––––––––
// Get my bookings
// ––––––––––––––––––
fetch(`/api/profile/bookings`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });


// ––––––––––––––––––
// Search my bookings
// ––––––––––––––––––
const params = new URLSearchParams({
  search_query: "#0329"
})
fetch(`/api/profile/bookings?#${params}`)
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```



<br>



#### [Update Bookings](#update-bookings)
Update one booking
Only an authenticated user can update his own booking.<br>
Only a staff user can update any booking.

###### REQUEST
`POST /api/bookings/update`


###### QUERY PARAMS
`None`


###### BODY
```swift
{
  booking_number: String,
  status: String
}
```

###### SUCCESS RESPONSES
```swift
200 OK
Content-Type: "application/json"

{
  message: "Updated",
  data: null
}
```

###### ERROR RESPONSES
```swift
405 METHOD NOT ALLOWED
Content-Type: "application/json"

{
  message: "GET request required",
  data: null
}
```

```swift
401 UNAUTHORIZED
Content-Type: "application/json"

{
  message: "Unauthorized",
  data: null
}
```

```swift
403 FORBIDDEN
Content-Type: "application/json"

{
  message: "Forbidden",
  data: null
}
```


```swift
404 NOT FOUND
Content-Type: "application/json"

{
  message: "Not found",
  data: null
}
```


###### SAMPLE CALL
```javascript
// Canceling a booking
fetch('/api/bookings', {
    method: "POST",
    body: JSON.stringify({
      booking_number: "c2bfbdcc-8e77-4d8a-b776-ff7ab44de3ca",
      status: "canceled"
    })
  })
  .then(res => res.json())
  .then(r => {
    console.log(r);
  });
```