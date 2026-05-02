import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Adjust the import path as necessary
import axios from '../api/axios'; // Adjust the import path as necessary

const CreatePostModal = () => {
  const { user } = useContext(AuthContext);
  const [postData, setPostData] = useState({
    content: '',
    image: '',
    imagePreview: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('content', postData.content);

      if (postData.image instanceof File) {
        formData.append('image', postData.image);
      }
      console.log('formData image', formData.get('image'));

      const res = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      setPostData({ content: '', image: '', imagePreview: '' });
      document.getElementById('create_post_modal')?.close();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6">
      <p className="font-bold mb-4">What's on your mind?</p>
      <button
        className="btn btn-primary w-full sm:w-auto max-w-full transition-all duration-200 ease-in-out
    transform hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-50"
        onClick={() => document.getElementById('create_post_modal').showModal()}
      >
        Create Post
      </button>
      <dialog id="create_post_modal" className="modal">
        <div className="modal-box w-full max-w-lg">
          <h3 className="text-lg font-bold mb-2">Create a new post</h3>

          <div className="flex items-center  mb-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar mr-8"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user?.image || ''}
                />
              </div>
            </div>
            <span className="font-medium">
              {user?.username || 'Unknown User'}
            </span>
          </div>

          <textarea
            placeholder="What's on your mind?"
            className="textarea textarea-primary mb-2"
            onChange={(e) => {
              setPostData({ ...postData, content: e.target.value });
            }}
          />
          <div className="flex flex-col w-full max-w-xs mb-3">
            <label htmlFor="image" className="text-lg mb-1">
              Upload an image:
            </label>

            <input
              type="file"
              name="image"
              accept="image/*"
              className="file-input file-input-info"
              onChange={(e) => {
                const file = e.target.files[0];
                setPostData({
                  ...postData,
                  image: file,
                  imagePreview: URL.createObjectURL(file), // 👈 add this
                });
              }}
            />
          </div>
          <div className="rounded-xl">
            <div className="w-50 rounded-xl ">
              {postData.imagePreview ? (
                <img src={postData.imagePreview} alt="" />
              ) : (
                <img src={postData.image ? postData.image : ' '} alt=" " />
              )}
            </div>
          </div>

          {/* <textarea */}
          {/*   className="textarea textarea-bordered w-full h-32 mb-4" */}
          {/*   placeholder="What's on your mind?" */}
          {/* ></textarea> */}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn"
              onClick={() => document.getElementById('create_post_modal')?.close()}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePost}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner mr-2" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreatePostModal;
