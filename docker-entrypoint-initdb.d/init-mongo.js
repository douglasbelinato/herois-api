db.createUser(
    {
        user: "heroiapp",
        pwd: "pass",
        roles: [
            {
                role: "readWrite",
                db: "herois"
            }
        ]
    }
)