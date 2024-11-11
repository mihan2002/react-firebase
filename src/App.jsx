import Auth from "./components/auth";
import { useEffect, useState } from "react";
import { db, auth, storage } from "./config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [editingId, setEditingId] = useState(null); // Track the ID of the movie being edited
  const [file, setFiles] = useState(null);

  const getMovieList = async () => {
    try {
      const data = await getDocs(collection(db, "movies"));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "movies"), {
        title,
        rating,
        releaseDate,
        userId: auth?.currentUser.uid,
      });
      setTitle("");
      setRating("");
      setReleaseDate("");
      alert("Movie added successfully!");
      getMovieList();
    } catch (error) {
      console.error("Error adding movie: ", error.message);
    }
  };

  const handleDeleteMovie = async (movie) => {
    if (auth.currentUser && auth.currentUser.uid === movie.userId) {
      try {
        await deleteDoc(doc(db, "movies", movie.id));
        alert("Movie deleted successfully!");
        getMovieList();
      } catch (error) {
        console.error("Error deleting movie: ", error);
      }
    } else {
      alert("You are not authorized to delete this movie.");
    }
  };

  const handleEditMovie = (movie) => {
    setEditingId(movie.id); // Set the ID of the movie being edited
    setTitle(movie.title);
    setRating(movie.rating);
    setReleaseDate(movie.releaseDate);
  };

  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await updateDoc(doc(db, "movies", editingId), {
        title,
        rating,
        releaseDate,
      });
      alert("Movie updated successfully!");
      setEditingId(null); // Reset editing ID
      setTitle("");
      setRating("");
      setReleaseDate("");
      getMovieList();
    } catch (error) {
      console.error("Error updating movie: ", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const fileRef = ref(storage, `movies/${file.name}`);
    try {
      await uploadBytes(fileRef, file).then((res) => {
        console.log(res);
        alert("File uploaded successfully!");
      });

      getDownloadURL(fileRef).then((url) => {
        console.log("Download URL:", url);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      {/* File Upload Section */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Upload a File
        </h2>
        <input
          type="file"
          onChange={(e) => setFiles(e.target.files[0])}
          className="mb-4 w-full text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded p-2 cursor-pointer"
        />
        <button
          onClick={handleFileUpload}
          className="w-full bg-green-500 text-white font-medium p-2 rounded hover:bg-green-600 transition"
        >
          Upload File
        </button>
      </div>

      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Movie Collection
      </h1>

      {/* Add / Edit Movie Form */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {editingId ? "Edit Movie" : "Add a New Movie"}
        </h2>
        <form
          onSubmit={editingId ? handleUpdateMovie : handleAddMovie}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter movie title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Rating:
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter rating (1-10)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Release Date:
            </label>
            <input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium p-2 rounded hover:bg-blue-600 transition"
          >
            {editingId ? "Update Movie" : "Add Movie"}
          </button>
        </form>
      </div>

      {/* Movie List */}
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Movie List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {movieList.map((movie) => (
            <div
              key={movie.id}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {movie.title}
                </h3>
                <p className="text-gray-600">Rating: {movie.rating}</p>
                <p className="text-gray-600">
                  Release Date: {new Date(movie.releaseDate).toDateString()}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEditMovie(movie)}
                  className="bg-yellow-500 text-white font-medium p-2 rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMovie(movie)}
                  className="bg-red-500 text-white font-medium p-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
