# Wardrobe Manager

My goal is to create an app that can recognise which item of clothing from my wardrobe I'm wearing so that I can keep track of which clothes I like or even the ones I don't wear at all.

## Current Status

- I can upload and label pictures to the database via a web app
- Using an AI model to separate all clothing items in an image - this works very well for pictures downloaded from clothes websites, but not for pictures taken in real life in my bedroom mirror

!()[localhost_5173.png]
!()[comparison_bedroom_mirror.jpg]
!()[comparison_shop_photo.jpg]

## Next Steps
- Next step is to find what can boost accuracy of semantic segmentation in pictures with a lot of noise - such as ones in my bedroom mirror rather than a professional studio
- be able to cut out the pixels of the segmented items and find what item they are by using an AI model trained on labelled photos in the database
