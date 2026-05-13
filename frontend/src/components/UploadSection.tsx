import { useRef, useState } from 'react';

export default function UploadSection() {
    const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
        return localStorage.getItem('wardrobePhoto'); // restore on reload
        });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isNewItem, setIsNewItem] = useState<boolean | null>(null);
    const [itemName, setItemName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // click handler for the button
    const handleButtonClick = () => {
        fileInputRef.current?.click(); // Simulates a click on the hidden file input
    };

    // what happens once the user takes a picture
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            const base64 = reader.result as string;
            setPhotoUrl(base64);
            localStorage.setItem('wardrobePhoto', base64); // persist it
            // Reset form state when a new photo is taken
            setIsNewItem(null);
            setItemName('');
            };
            reader.readAsDataURL(file);
        }
    };

    // clears the preview and goes back to the base page
    const handleReset = () => {
        setPhotoUrl(null);
        setIsNewItem(null);
        setItemName('');
        localStorage.removeItem('wardrobePhoto');
    };

    // send the image to the FastAPI backend...
    const handleSubmit = async () => {
        if (!photoUrl) return;
        setIsSubmitting(true);
        if (isNewItem) {
            try {
                await fetch('/add/new', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: photoUrl,
                        name: isNewItem ? itemName : undefined,	
                }),
                });
            } catch (error) {
                console.error('Upload failed:', error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            try {
                await fetch('/add/existing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: photoUrl,
                        name: isNewItem ? itemName : undefined,	
                }),
                });
            } catch (error) {
                console.error('Upload failed:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    }

    return (
        <section id="center" style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Wardrobe Manager</h1>
        
        {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }} 
            />

            <button
                type="button"
                className="add-photo-btn"
                onClick={handleButtonClick}
            >
            + Add Photo
            </button>

        {/* Preview the taken photo */}
            {photoUrl && (
            <div className="photo-preview" style={{ marginTop: '20px' }}>
                <h3>Preview:</h3>
                    <img 
                    src={photoUrl} 
                    alt="Wardrobe item" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                />

                {/* Is this a new item? */}
                {isNewItem === null && (
                    <div style={{ marginTop: '16px' }}>
                    <p>Is this a new item of clothing?</p>
                    <button type="button" onClick={() => setIsNewItem(true)}>Yes</button>
                    <button type="button" onClick={() => setIsNewItem(false)} style={{ marginLeft: '8px' }}>No</button>
                    </div>
                )}

                {/* Submit new item's name if it's a new item */}
                {isNewItem !== null && (
                    <div style={{ marginTop: '16px' }}>
                        {isNewItem && (
                            <div>
                                <label>Item Name:</label>
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="e.g. blue-denim-jacket"
                                    style={{ marginLeft: '8px' }}
                                />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            style={{ marginTop: '8px' }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button type="button" onClick={handleReset}>Cancel</button>
                    </div>
                )}
            </div>
            )}
    </section>
    );
    }