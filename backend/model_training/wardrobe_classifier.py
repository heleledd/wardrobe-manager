from fastai.vision.all import *

# TODO: Update to use images stored in the database :))

path = Path('wardrobe')

# Print list of every image file found inside the wardrobe folder
fns = get_image_files(path)
print(f'Found {len(fns)} images across {len(path.ls())} clothing items')
print('Items found:', [f.name for f in path.ls()])

dls = DataBlock(
    # inputs are images, outputs are categories (clothing item names)
    blocks=(ImageBlock, CategoryBlock),
    
    # search inside 'path' for the images
    get_items=get_image_files,

    # use 20% of photos for checking accuracy, 80% for training
    splitter=RandomSplitter(valid_pct=0.2, seed=42),

    # the label for each photo is the name of its parent folder
    get_y=parent_label,

    # Before training, resize every image to 224x224 pixels
    # RandomResizedCrop crops a random portion of the image each time —
    # this is a form of data augmentation that makes the model more robust
    item_tfms=RandomResizedCrop(224, min_scale=0.5),
    
    # add random flips and contrast changes so that the AI can recognise 
    batch_tfms=aug_transforms()
).dataloaders(path, bs=16) # process 16 images at a time

# show pictures with correct clothing items below to show everything loaded ok
dls.show_batch(max_n=6)

learn = vision_learner(dls, resnet34, metrics=error_rate)
learn.fine_tune(5)          # train for 5 epochs
learn.export('wardrobe_model.pkl')   # saves the trained model to disk