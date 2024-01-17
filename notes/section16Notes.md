# Goal 
- implement API image uploading

# Storage Options
- database is inefficient and has disk space issue
- file system has disk space issue and issue with server running out of space and crashing
- cloud service is the best optoin 
    - scaleable 
    - secured with API key 
    - could be more expensive

# Setting up Cloudinary 
- need to add the cloud name, API key and API secrety to the appsettings.json 
- need to add new config to our services

# Cloudinary
- cloudinary API will return a photoUploadReuslt which will have a Ulr and public Id
- this is what is being added to db

# Overall process
- Application will have interface to access photos with the methods
    - infrastrucutre will implement the PhotoAccessor 
        - need to create an instance to the cloudinary account
            - need cloudinarySetting class for this to maintain keys, name and Secret 
- Application will have the photoUpload result 
- Application will have the command and handler for Add and Delete photos


# Add Interface 
- add interface to add and delete photos
- added cloudinary to infrastrucuture but our application needs to access it so we need to create an interface for it in application 
    - defined the implementation of it in the infrastrucuture 
    - add scoped service for photoAccessor

#  Implent Interface 
- need a cloudinarySetting Model in infra 
- implment the PhotoAccessor with the interface 
    -  need access to cloudinary config and create new instance of cloudinary to use methods from it
    - need to implement add and remove logic 

# Photo Domain
- create new Entity to be used by users
- add to dataContext as dataSet so we can access it from _context

# Command/Handler API 
- same command/Handler set up as the others, bring in _context, _userAccessor, and _photoAccessor
- controller is similar but will use formBody for adding photo

# Profile Section 
- create the Profile details command/handler
    - will use auto mapper so need to updatethe Mappingprofiles
- create the Profile Controller for API
- will need to create a DTO because we are returning the profile for attendees but we dont want be returning the photos of attendees 
    - will create an attendee DTO which is identicla to profile minius the photos
    - need to update the mapping 
    - need to update the ActivityDTO so its returning attendeDTO instaed of profile 

