export default [
    {
      "id": 3,
      "nombre": "Puja de Arte Moderno",
      "descripcion": "Una increíble pieza de arte moderno",
      "pujaInicial": "500",
      "fechaFin": "2024-12-31T23:59:59.000Z",
      "creator": {
        "email": "federico.gonzalez@example.com",
        "username": "FedericoG",
        "password": "securePassword123",
        "role": 0,
        "banned": false,
        "balance": "101.00"
      },
      "imagenes": [
        {
          "id": 3,
          "url": "https://example.com/images/arte1.jpg"
        },
        {
          "id": 4,
          "url": "https://example.com/images/arte2.jpg"
        }
      ],
      "bids": [
        {
          "id": 4,
          "amount": "105.00",
          "puja": {
            "id": 3,
            "nombre": "Puja de Arte Moderno",
            "descripcion": "Una increíble pieza de arte moderno",
            "pujaInicial": "500",
            "fechaFin": "2024-12-31T23:59:59.000Z"
          },
          "user": {
            "email": "carlos.lopez@example.com",
            "username": "CarlosL",
            "password": "yetAnotherPassword789",
            "role": 2,
            "banned": false,
            "balance": "301.00"
          }
        }
      ]
    },
    {
      "id": 4,
      "nombre": "Puja de Arte Moderno",
      "descripcion": "Una increíble pieza de arte moderno",
      "pujaInicial": "500",
      "fechaFin": "2024-12-31T23:59:59.000Z",
      "creator": {
        "email": "federico.gonzalez@example.com",
        "username": "FedericoG",
        "password": "securePassword123",
        "role": 0,
        "banned": false,
        "balance": "101.00"
      },
      "imagenes": [
        {
          "id": 5,
          "url": "https://example.com/images/arte1.jpg"
        },
        {
          "id": 6,
          "url": "https://example.com/images/arte2.jpg"
        }
      ],
      "bids": [
        {
          "id": 5,
          "amount": "105.00",
          "puja": {
            "id": 4,
            "nombre": "Puja de Arte Moderno",
            "descripcion": "Una increíble pieza de arte moderno",
            "pujaInicial": "500",
            "fechaFin": "2024-12-31T23:59:59.000Z"
          },
          "user": {
            "email": "carlos.lopez@example.com",
            "username": "CarlosL",
            "password": "yetAnotherPassword789",
            "role": 2,
            "banned": false,
            "balance": "301.00"
          }
        },
        {
          "id": 6,
          "amount": "105.00",
          "puja": {
            "id": 4,
            "nombre": "Puja de Arte Moderno",
            "descripcion": "Una increíble pieza de arte moderno",
            "pujaInicial": "500",
            "fechaFin": "2024-12-31T23:59:59.000Z"
          },
          "user": {
            "email": "laura.perez@example.com",
            "username": "LauraP",
            "password": "anotherSecurePassword456",
            "role": 1,
            "banned": true,
            "balance": "250.00"
          }
        }
      ]
    }
  ]