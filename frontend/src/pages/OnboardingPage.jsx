import {useState } from 'react';
import useAuthUser from '../hooks/useAuthUser.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api.js';
import { CameraIcon, LoaderIcon, MapIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants/index.js';

const OnboardingPage = () => {

  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || " ",
    bio: authUser?.bio || " ",
    nativeLanguage: authUser?.nativeLanguage || " ",
    learningLanguage: authUser?.learningLanguage || " ",
    location: authUser?.location || " ", // Changed 'loaction' to 'location'
    profilePic: authUser?.profilePic || " ",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully.");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message)
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; //1 - 100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profilePic generated.");
  }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* profile pic */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* image preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {
                  formState.profilePic ? (
                    <img src={formState.profilePic} alt="profile preview" className='w-full h-full object-cover'/>
                  ): (
                      <div className='flex items-center justify-center h-full'>
                        <CameraIcon className='size-12 text-base-content opacity-40'/>
                    </div>
                  )
                }
              </div>

              {/* generate random avatar btn */}
              <div className="flex items-center gap-2">
                <button type='button' onClick={handleRandomAvatar} className='btn btn-accent'><ShuffleIcon className='size-4 mr-2'/>Generate Random Avatar</button>
              </div>
            </div>
            {/* full Name */}
              <div className="form-control"> 
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input type="text"
                  name='fullName'
                  placeholder="Your full name"
                  className="input input-bordered w-full"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                />
              </div>

              {/* Bio */}
              <div className="form-control"> 
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <input type="text"
                  name='bio'
                  placeholder="Tell others about yourself and your language learning goals. "
                  className="textarea textarea-bordered"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                />
              </div>

            {/* language */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* native language */}
              <div className="form-control">
                <label className='label'>
                  <span className='label-text'>Native language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                  className='select select-bordered w-full'
                >
                  <option value="">Select your native language</option>
                  {
                    LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))
                  }
                </select>
              </div>

              {/* learning language */}
              <div className="form-control">
                <label className='label'>
                  <span className='label-text'>Learning language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                  className='select select-bordered w-full'
                >
                  <option value="">Select your learning language</option>
                  {
                    LANGUAGES.map((lang) => (
                      <option key={`learning-${lang}`} value={lang.toLowerCase()}>{lang}</option>
                    ))
                  }
                </select>
              </div>              
            </div>

            {/* location */}
            <div className="form-control">
              <label className='label'>
                <span className='label-text'>Location</span>
              </label>
              <div className="relative">
                <MapIcon className='absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70' />
                <input
                  type="text"
                  name='location'
                  value={formState.location} // Changed 'loaction' to 'location'
                  onChange={(e) => setFormState({...formState, location:e.target.value})} // Changed 'loaction' to 'location'
                  className='input input-bordered w-full pl-10'
                  placeholder='city, country'
                />                
              </div>
            </div>  

            {/* submit btn */}
            <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
              {
                !isPending ? (
                  <>
                    <ShipWheelIcon className='size-5 mr-2' />
                    Complete onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className='animate-spinsize-5 mr-2' /> 
                    Onboarding...
                  </>
                )
              }
            </button>

          </form>
        </div>
      </div>
      
    </div>
  )
}

export default OnboardingPage
