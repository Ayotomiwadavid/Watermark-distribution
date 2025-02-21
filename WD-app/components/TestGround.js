import { useState, useRef } from 'react';
import { LucideUpload, LucideType, LucideImage, LucideMove, LucideDownload, LucideArrowUp, LucideArrowDown, LucideArrowLeft, LucideArrowRight } from 'lucide-react';

const WatermarkEditor = () => {
    const [baseImage, setBaseImage] = useState(null);
    const [watermarkType, setWatermarkType] = useState('text');
    const [watermarkText, setWatermarkText] = useState('Your Watermark');
    const [watermarkImage, setWatermarkImage] = useState(null);
    const [position, setPosition] = useState({ x: 50, y: 50 });
    const [isDragging, setIsDragging] = useState(false);
    const [textStyle, setTextStyle] = useState({
        fontSize: 24,
        color: '#000000',
        fontFamily: 'Arial',
        isBold: false,
        isItalic: false,
    });

    const containerRef = useRef(null);
    const baseImageRef = useRef(null);
    const watermarkImageRef = useRef(null);

    const handleBaseImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setBaseImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleWatermarkImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setWatermarkImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleMouseDown = (e) => {
        if (!baseImage) return;

        const container = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - container.left) / container.width) * 100;
        const y = ((e.clientY - container.top) / container.height) * 100;

        setPosition({ x, y });
        setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !baseImage) return;

        const container = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - container.left) / container.width) * 100;
        const y = ((e.clientY - container.top) / container.height) * 100;

        setPosition({
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y)),
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleNudge = (direction) => {
        const nudgeAmount = 1; // 1% of the container size
        setPosition(prev => {
            const newPos = { ...prev };

            switch (direction) {
                case 'up':
                    newPos.y = Math.max(0, prev.y - nudgeAmount);
                    break;
                case 'down':
                    newPos.y = Math.min(100, prev.y + nudgeAmount);
                    break;
                case 'left':
                    newPos.x = Math.max(0, prev.x - nudgeAmount);
                    break;
                case 'right':
                    newPos.x = Math.min(100, prev.x + nudgeAmount);
                    break;
            }

            return newPos;
        });
    };

    const handleDownload = async () => {
        if (!baseImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create and load the base image
        const baseImg = new Image();
        baseImg.crossOrigin = 'anonymous';

        // Create a promise to handle base image loading
        const loadBaseImage = new Promise((resolve) => {
            baseImg.onload = () => {
                canvas.width = baseImg.width;
                canvas.height = baseImg.height;
                ctx.drawImage(baseImg, 0, 0);
                resolve();
            };
        });

        // Load base image
        baseImg.src = baseImage;
        await loadBaseImage;

        // Function to add text watermark
        const addTextWatermark = () => {
            ctx.fillStyle = textStyle.color;
            let font = `${textStyle.isBold ? 'bold ' : ''}${textStyle.isItalic ? 'italic ' : ''}${textStyle.fontSize}px ${textStyle.fontFamily}`;
            ctx.font = font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const x = (position.x / 100) * canvas.width;
            const y = (position.y / 100) * canvas.height;
            ctx.fillText(watermarkText, x, y);
        };

        // Function to add image watermark
        const addImageWatermark = () => {
            return new Promise((resolve) => {
                if (watermarkImage) {
                    const watermarkImg = new Image();
                    watermarkImg.crossOrigin = 'anonymous';
                    watermarkImg.onload = () => {
                        const watermarkWidth = Math.min(canvas.width * 0.3, 300); // Limit watermark size
                        const aspectRatio = watermarkImg.height / watermarkImg.width;
                        const watermarkHeight = watermarkWidth * aspectRatio;

                        const x = ((position.x / 100) * canvas.width) - (watermarkWidth / 2);
                        const y = ((position.y / 100) * canvas.height) - (watermarkHeight / 2);

                        ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
                        resolve();
                    };
                    watermarkImg.src = watermarkImage;
                } else {
                    resolve();
                }
            });
        };

        try {
            // Add appropriate watermark based on type
            if (watermarkType === 'text') {
                addTextWatermark();
            } else if (watermarkType === 'image') {
                await addImageWatermark();
            }

            // Create and trigger download
            const link = document.createElement('a');
            link.download = 'watermarked-image.png';
            link.href = canvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error creating watermarked image:', error);
            alert('There was an error creating the watermarked image. Please try again.');
        }
    };

    // Create a Nudge Button component for reusability
    const NudgeButton = ({ direction, icon: Icon }) => (
        <button
            onClick={() => handleNudge(direction)}
            className="p-2 hover:bg-gray-100 rounded"
            aria-label={`Move watermark ${direction}`}
        >
            <Icon size={20} />
        </button>
    );

    return (
        <div className="max-w-4xl mt-16 md:mt-28 mx-auto p-4">

            <div className="relative">
                <div
                    ref={containerRef}
                    className="relative w-full aspect-video bg-gray-100 rounded overflow-hidden cursor-move"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {baseImage && (
                        <img
                            ref={baseImageRef}
                            src={baseImage}
                            alt="Base"
                            className="w-full h-full md:w-full md:h-full object-contain"
                        />
                    )}

                    {baseImage && watermarkType === 'text' && (
                        <div
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                transform: 'translate(-50%, -50%)',
                                color: textStyle.color,
                                fontSize: `${textStyle.fontSize}px`,
                                fontFamily: textStyle.fontFamily,
                                fontWeight: textStyle.isBold ? 'bold' : 'normal',
                                fontStyle: textStyle.isItalic ? 'italic' : 'normal',
                            }}
                            className="absolute select-none pointer-events-none"
                        >
                            {watermarkText}
                        </div>
                    )}

                    {baseImage && watermarkType === 'image' && watermarkImage && (
                        <img
                            ref={watermarkImageRef}
                            src={watermarkImage}
                            alt="Watermark"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                            className="absolute w-24 h-24 object-contain select-none pointer-events-none"
                        />
                    )}

                    {!baseImage && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <LucideUpload size={48} className="mx-auto mb-2" />
                                <p>Upload an image to begin</p>
                            </div>
                        </div>
                    )}
                </div>


            </div>

            <div>
            {baseImage && (
                <div className="mt-2 text-sm text-gray-500 text-center">
                    Position: X: {position.x.toFixed(1)}%, Y: {position.y.toFixed(1)}%
                </div>
            )}
            </div>

            <div className="mt-4 flex flex-col text-center items-center justify-between">
                <div className="text-gray-500 flex items-center gap-2">
                    <LucideMove size={20} />
                    <span className='text-xs md:text-md'>Click and drag or use arrow buttons to position the watermark</span>
                </div>
            </div>

            <div className='flex w-full items-center justify-between mt-2'>
                {/* Nudge Controls */}
                {baseImage && (
                    <div className="flex gap-1">
                        <NudgeButton direction="up" icon={LucideArrowUp} />
                        <div className="flex justify-start gap-1">
                            <NudgeButton direction="left" icon={LucideArrowLeft} />
                            <NudgeButton direction="right" icon={LucideArrowRight} />
                        </div>
                        <NudgeButton direction="down" icon={LucideArrowDown} />
                    </div>
                )}


                {baseImage && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <LucideDownload size={20} />
                        Save
                    </button>
                )}
            </div>

            <div className="my-6 space-y-4">
                <div className="flex gap-4">
                    <button
                        onClick={() => setWatermarkType('text')}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${watermarkType === 'text' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        <LucideType size={20} /> Text Watermark
                    </button>
                    <button
                        onClick={() => setWatermarkType('image')}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${watermarkType === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        <LucideImage size={20} /> Image Watermark
                    </button>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Upload Base Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBaseImageUpload}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {watermarkType === 'image' && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">Upload Watermark Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleWatermarkImageUpload}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}
                </div>

                {watermarkType === 'text' && (
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={watermarkText}
                            onChange={(e) => setWatermarkText(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter watermark text"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Font Size</label>
                                <input
                                    type="number"
                                    value={textStyle.fontSize}
                                    onChange={(e) => setTextStyle({ ...textStyle, fontSize: parseInt(e.target.value) })}
                                    className="w-full p-2 border rounded"
                                    min="8"
                                    max="72"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Color</label>
                                <input
                                    type="color"
                                    value={textStyle.color}
                                    onChange={(e) => setTextStyle({ ...textStyle, color: e.target.value })}
                                    className="w-full h-10 border rounded"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setTextStyle({ ...textStyle, isBold: !textStyle.isBold })}
                                className={`px-4 py-2 rounded ${textStyle.isBold ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Bold
                            </button>
                            <button
                                onClick={() => setTextStyle({ ...textStyle, isItalic: !textStyle.isItalic })}
                                className={`px-4 py-2 rounded ${textStyle.isItalic ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                            >
                                Italic
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {/* Position Display */}
            
        </div>
    );
};

export default WatermarkEditor;