import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profile, updateProfile } from '../redux/userSlice';
import Loader from '../layout/Loader';
import { toast } from 'react-toastify';
import { AiOutlineCopy } from 'react-icons/ai'
const Profile = () => {
  const wa = useRef(null)
  const email = useRef(null)
  const dispatch = useDispatch();
  const { user, loading, updateUserLoader } = useSelector((state) => state.auth);
  const url = "https://meet.ceoitbox.com/";
  const [showDialogWA, setShowDialogWA] = useState(false);
  const [showDialogEmail, setShowDialogEmail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [expertIn, setExpertIn] = useState('');
  const [link, setLink] = useState('');
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [msg, setMessage] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [clientMail, setClientMail] = useState("")
  const [copy, setCopy] = useState("")
  const [isCopy, setIsCopy] = useState(false)
  const [err,setErr]=useState("")
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);
  const copyFunc = async () => {
    setCopy(`${url}${link}`);
    try {
      await navigator.clipboard.writeText(copy);
      setIsCopy(true);
      setTimeout(() => {
        setIsCopy(false);
      }, 10000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar ? user.avatar.url : null);
      setPhone(user.phone || '');
      setExpertIn(user.expertIn || '');
      setLink(user.slug || '');
    }
  }, [user]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setName(user.name);
    setAvatar(user.avatar ? user.avatar.url : null);
    setPhone(user.phone || '');
    setExpertIn(user.expertIn || '');
    setLink(user.slug || '');
  };

  const handleSaveClick = async () => {
    const res = await dispatch(updateProfile({ name, avatar, phone, expertIn, link }));
    if (updateProfile.fulfilled.match(res)) {
      toast.success(res.payload);
      dispatch(profile());
    } else if (updateProfile.rejected.match(res)) {
      toast.error(res.payload);
      dispatch(profile());
    }
    setEditMode(false);
  };

  const shareOnEmail = () => {
    const emailLink = `https://mail.google.com/mail/?view=cm&fs=1`;
    window.open(emailLink,"_blank");
};



  const shareOnWA = () => {
    if(!phoneNumber || !msg){
      setErr("All fields are required.")
      return
    }
    // Regular expression to match a phone number with a leading '+'
    const phoneRegex = /^\+[0-9]+/;
  
    if (phoneRegex.test(phoneNumber)) {
      // Phone number has a valid country code
      const whatsappLink = `https://wa.me/${encodeURIComponent(phoneNumber)}?text=${encodeURIComponent(msg.concat(` ${url}${link}`))}`;
      window.open(whatsappLink, '_blank');
    } else {
      setErr('Please provide a phone number with a valid country code (e.g., +91XX.....).')
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <Loader />
      ) : (
        <>
          {user ? (
            <div className="bg-gray-100 shadow-lg p-8 rounded-lg mx-auto w-full">
              <div className="flex items-center justify-center md:flex-row flex-col mb-4 gap-16">
                <div className="relative">
                  {editMode && avatar ? (
                    <img src={avatar} alt="Avatar Preview" className="w-[278px] rounded-full object-cover shadow-md" />
                  ) : user.avatar ? (
                    <img src={user.avatar.url} alt="Avatar" className="w-[278px] rounded-full object-cover shadow-md" />
                  ) : (
                    <div className="w-[278px]  rounded-full bg-gray-300 mr-4"></div>
                  )}
                  {editMode && (
                    <label htmlFor="profile-image" className="absolute bottom-0 right-4 bg-blue-500 rounded-full text-white p-2 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M16 6a6 6 0 11-12 0 6 6 0 0112 0zm2 6a8 8 0 10-16 0v1a1 1 0 001 1h14a1 1 0 001-1v-1z" clipRule="evenodd" />
                      </svg>
                      <input id="profile-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>
                <div className="ml-4 w-full md:w-[50%] mx-auto">
                  <div className="w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      readOnly={!editMode}
                      onChange={handleNameChange}
                      className="w-full px-4 py-2 mt-1 border rounded focus:outline-none"
                      placeholder="Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">
                      Email
                    </label>
                    <input
                      id="email"
                      type="text"
                      readOnly
                      value={user.email}
                      className="w-full px-4 py-2 mt-1 border rounded focus:outline-none bg-white"
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mt-4">
                      Mobile No.
                    </label>
                    <input
                      id="phone"
                      type="text"
                      readOnly={!editMode}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 mt-1 border rounded focus:outline-none"
                      placeholder="Mobile No."
                    />
                  </div>

                  <div>
                    <label htmlFor="expertIn" className="block text-sm font-medium text-gray-700 mt-4">
                      Expert In
                    </label>
                    <input
                      id="expertIn"
                      maxLength={35}
                      type="text"
                      value={expertIn}
                      readOnly={!editMode}
                      onChange={(e) => setExpertIn(e.target.value)}
                      className="w-full px-4 py-2 mt-1 border rounded focus:outline-none"
                      placeholder="Expert In"
                    />
                  </div>

                  <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700 mt-4">
                      Your Link
                    </label>
                    <div className="w-full flex justify-between items-center bg-white px-4 py-2 mt-1 border rounded">
                      <div>
                        <span>{url}</span>
                        <input
                          id="link"
                          maxLength={35}
                          type="text"
                          value={link}
                          readOnly={!editMode}
                          onChange={(e) => setLink(e.target.value)}
                          className="focus:outline-none"
                          placeholder="Unique username"
                        />
                      </div>
                      <AiOutlineCopy className={`${isCopy ? 'text-green-500' : 'text-gray-500'} cursor-pointer`} onClick={copyFunc} />


                    </div>
                  </div>
                  
                </div>
              </div>
              <div className="flex justify-end">
                {editMode ? (
                  <>
                    <button className="text-gray-500 hover:underline mr-2" onClick={handleCancelClick}>
                      Cancel
                    </button>
                    <button
                      disabled={updateUserLoader}
                      className={`px-4 py-2 w-24 text-white rounded border-1 bg-blue-500 hover:bg-blue-600 ${updateUserLoader
                        ? 'cursor-not-allowed'
                        : ''
                        }`}
                      onClick={handleSaveClick}
                    >
                      {updateUserLoader ? (
                        <div className="w-6 h-6  mx-auto border-r-2  border-t-2 border-white border-solid rounded-full animate-spin"></div>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleEditClick}
                  >
                    Edit Profile
                  </button>
                )}
                <button
                  onClick={shareOnEmail}
                  className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
                >
                  Share via Email
                </button>
                <button
                  onClick={() => {
                    wa.current.showModal()
                    setShowDialogWA(true)
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded ml-2 hover:bg-green-700"
                >
                  Share via WhatsApp
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-500">Error: Failed to fetch user data.</div>
          )}
        </>
      )}

      <div className='relative'>
        {showDialogWA && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-80 z-50" ></div>
        )}
        <dialog ref={wa} className={`${showDialogWA ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} rounded transform origin-top transition-transform duration-300 ease-out`}>
          <h1 className='text-xl my-2'>WhatsApp Message</h1>
          <div className='w-[300px] md:w-[500px] my-4'>
            <input onChange={(e) => setPhoneNumber(e.target.value)} required className='w-full mb-4 outline-none focus-none border border-gray-100 shadow-sm px-4 py-1' placeholder='phone number with country code eg. +91XXXXXXXXXX' value={phoneNumber} />
            <textarea value={msg} rows={5} required className='w-full outline-none focus-none border border-gray-100 shadow-sm px-4 py-1' placeholder='Message' onChange={(e) => setMessage(e.target.value)} />

          </div>
          <div className='text-red-500 my-4'>
          <small>
          <i>
                    <b>{err}</b>
                  </i></small></div>
          <div className='flex items-center justify-between mt-4'>
            <button className='bg-red-500 text-white rounded-sm py-1 px-4' onClick={() => {
              wa.current.close()
              setShowDialogWA(false)
              setErr("")
            }}>Close</button>
            <button className='bg-green-500 text-white rounded-sm py-1 px-4' onClick={shareOnWA}>Share</button>
          </div>
        </dialog>
      </div>
      <div className='relative'>
        {showDialogEmail && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 opacity-80 z-50" ></div>
        )}
        <dialog ref={email} className={`${showDialogEmail ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} rounded transform origin-top transition-transform duration-300 ease-out`} >
          <h1 className='text-xl my-2'>Email</h1>
          <div className='w-[300px] md:w-[500px] my-4'>
            <input required onChange={(e) => setClientMail(e.target.value)} className='w-full mb-4 outline-none focus-none border border-gray-100 shadow-sm px-4 py-1' placeholder='to' value={clientMail} />
            <input required onChange={(e) => setSubject(e.target.value)} className='w-full mb-4 outline-none focus-none border border-gray-100 shadow-sm px-4 py-1' placeholder='subject' value={subject} />
            <textarea required rows={5} onChange={(e) => setBody(e.target.value)} className='w-full outline-none focus-none border border-gray-100 shadow-sm px-4 py-1' placeholder='body' value={body} />

          </div>
          <div className='flex items-center justify-between mt-4'>
            <button className='bg-red-500 text-white rounded-sm py-1 px-4' onClick={() => {
              email.current.close()
              setShowDialogEmail(false)
            }}>Close</button>
            <button className='bg-green-500 text-white rounded-sm py-1 px-4' onClick={shareOnEmail}>Share</button>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Profile;
