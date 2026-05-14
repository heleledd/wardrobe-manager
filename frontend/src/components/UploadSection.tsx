import { useRef, useState, useEffect } from 'react';

interface WardrobeItemOption {
    id: number;
    name: string;
}

export default function UploadSection() {
    const [photoUrl, setPhotoUrl] = useState<string | null>(() => {
        return localStorage.getItem('wardrobePhoto');
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [existingItems, setExistingItems] = useState<WardrobeItemOption[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | 'new' | null>(null);
    const [newItemName, setNewItemName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch existing items on mount
    useEffect(() => {
        fetch('/items')
        .then(res => {
            console.log('Status:', res.status); 
            return res.json();
        })
        .then((data: WardrobeItemOption[]) => {
            const unique = data.filter(
                (item, index, self) =>
                index === self.findIndex((i) => i.name === item.name)
            );
            setExistingItems(unique);
        })
        .then(() => console.log('Items loaded:', existingItems))
        .catch(err => console.error('Failed to load items:', err));
        }, []);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setPhotoUrl(base64);
                localStorage.setItem('wardrobePhoto', base64);
                setSelectedItemId(null);
                setNewItemName('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setPhotoUrl(null);
        setSelectedItemId(null);
        setNewItemName('');
        localStorage.removeItem('wardrobePhoto');
    };

    const handleSubmit = async () => {
        if (!photoUrl || selectedItemId === null) return;
        setIsSubmitting(true);

        const body =
            selectedItemId === 'new'
                ? { image: photoUrl, name: newItemName }
                : { image: photoUrl, item_id: selectedItemId };

        try {
            await fetch('/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            handleReset();
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit =
        selectedItemId !== null &&
        (selectedItemId !== 'new' || newItemName.trim().length > 0);

    return (
        <section id="center" style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Wardrobe Manager</h1>
            <p>Upload labelled images to train the AI model</p>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            <button type="button" className="add-photo-btn" onClick={handleButtonClick}>
                + Add Photo
            </button>

            {photoUrl && (
                <div className="photo-preview" style={{ marginTop: '20px' }}>
                    <h3>Preview:</h3>
                    <img
                        src={photoUrl}
                        alt="Wardrobe item"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    />

                    <div style={{ marginTop: '16px' }}>
                        <label htmlFor="item-select">Add to item: </label>
                        <select
                            id="item-select"
                            value={selectedItemId ?? ''}
                            onChange={e => {
                                const val = e.target.value;
                                setSelectedItemId(val === 'new' ? 'new' : Number(val));
                                setNewItemName('');
                            }}
                        >
                            <option value="" disabled>-- Select --</option>
                            {existingItems.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                            <option value="new">+ Add new item</option>
                        </select>
                    </div>

                    {selectedItemId === 'new' && (
                        <div style={{ marginTop: '12px' }}>
                            <label>New item name: </label>
                            <input
                                type="text"
                                value={newItemName}
                                onChange={e => setNewItemName(e.target.value)}
                                placeholder="e.g. blue-denim-jacket"
                                style={{ marginLeft: '8px' }}
                            />
                        </div>
                    )}

                    <div style={{ marginTop: '12px' }}>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !canSubmit}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button type="button" onClick={handleReset} style={{ marginLeft: '8px' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}