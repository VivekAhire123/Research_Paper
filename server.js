import { app } from "./app.js";

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
