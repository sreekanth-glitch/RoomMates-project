'use client';

import { useState } from 'react';

const RoomForm = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    totalRent: '',
    rentPerHead: '',
    area: '',
    city: '',
    description: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const selectedImage = files[0];
      if (selectedImage && selectedImage.size > 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Image size should be less than 1MB' }));
        setForm((prev) => ({ ...prev, image: null }));
      } else {
        setErrors((prev) => ({ ...prev, image: '' }));
        setForm((prev) => ({ ...prev, image: selectedImage }));
      }
    } else {
      if ((name === 'phone' || name === 'totalRent' || name === 'rentPerHead') && /[^0-9]/.test(value)) return;
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    else if (form.name.length > 20) newErrors.name = 'Name must be max 20 characters';

    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (form.phone.length > 14) newErrors.phone = 'Phone must be max 14 digits';

    if (!form.city.trim()) newErrors.city = 'City is required';
    else if (form.city.length > 20) newErrors.city = 'City must be max 20 characters';

    if (form.totalRent.length > 7) newErrors.totalRent = 'Max 7 digits allowed';
    if (form.rentPerHead.length > 6) newErrors.rentPerHead = 'Max 6 digits allowed';

    if (form.totalRent && form.rentPerHead && Number(form.rentPerHead) > Number(form.totalRent)) {
      newErrors.rentPerHead = 'Rent per head cannot exceed total rent';
    }

    if (form.description.length > 50) newErrors.description = 'Max 50 characters allowed';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to submit.');
          return;
        }
  
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phone', form.phone);
        formData.append('total', form.totalRent);       // Changed key
        formData.append('perHead', form.rentPerHead);   // Changed key
        formData.append('area', form.area);
        formData.append('city', form.city);
        formData.append('description', form.description);
        formData.append('image', form.image);
  
        const res = await fetch('https://room-mates-brown.vercel.app/api/room', {
          method: 'POST',
          headers: {
            token: token, // Corrected header
          },
          body: formData,
        });
  
        const data = await res.json();
  
        if (res.ok) {
          alert('Room added successfully!');
          setForm({
            name: '',
            phone: '',
            totalRent: '',
            rentPerHead: '',
            area: '',
            city: '',
            description: '',
            image: '',
          });

          window.location.reload();
  
          // Update preview manually
        
        } else {
          alert(data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Server error. Please try again.');
      }
    }
  };
  

  return (
    <div className="bg-gray-100 px-10 pt-30 flex justify-center sm:p-15">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1c4475]">Share room details</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Input Fields */}
          {[
            { label: 'Name *', name: 'name', placeholder: 'Enter your name' },
            { label: 'Phone *', name: 'phone', placeholder: 'Enter your phone' },
            { label: 'Total Rent', name: 'totalRent', placeholder: 'Total rent' },
            { label: 'Rent Per Head', name: 'rentPerHead', placeholder: 'Rent per head' },
            { label: 'Area', name: 'area', placeholder: 'Enter area' },
            { label: 'City *', name: 'city', placeholder: 'Enter city' },
            { label: 'Description', name: 'description', placeholder: 'Optional' },
          ].map(({ label, name, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full p-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}

          {/* Image Input */}
          {/* Image Input */}
<div>
  <label className=" block text-sm font-medium text-gray-700 mb-1">Image</label> {/* Removed * */}
  <input
    type="file"
    name="image"
    accept="image/*"
    onChange={handleChange}
    className="w-full text-sm text-gray-700
               file:mr-4 file:py-2 file:px-4
               file:rounded-md file:border-0
               file:text-sm file:font-semibold
               file:bg-orange-100 file:text-orange-700
               hover:file:bg-orange-200
               border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
  />
  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
</div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 cursor-pointer bg-[#1c4475] text-orange-400 font-semibold rounded-md hover:bg-[#0f2947] transition duration-300 active:scale-95"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;
