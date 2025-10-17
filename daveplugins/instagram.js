const { igdl } = require("ruhend-scraper");

// Store processed message IDs to prevent duplicates
const processedMessages = new Set();

// Function to extract unique media URLs with simple deduplication
function extractUniqueMedia(mediaData) {
    const uniqueMedia = [];
    const seenUrls = new Set();
    
    for (const media of mediaData) {
        if (!media.url) continue;
        
        // Only check for exact URL duplicates
        if (!seenUrls.has(media.url)) {
            seenUrls.add(media.url);
            uniqueMedia.push(media);
        }
    }
    
    return uniqueMedia;
}

let daveplug = async (m, { dave, reply, text }) => {
    try {
        // Check if message has already been processed
        if (processedMessages.has(m.key.id)) {
            return;
        }
        
        // Add message ID to processed set
        processedMessages.add(m.key.id);
        
        // Clean up old message IDs after 5 minutes
        setTimeout(() => {
            processedMessages.delete(m.key.id);
        }, 5 * 60 * 1000);

        if (!text) {
            return reply("Please provide an Instagram link for the video.");
        }

        // Check for various Instagram URL formats
        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//,
            /https?:\/\/(?:www\.)?instagram\.com\/p\//,
            /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
            /https?:\/\/(?:www\.)?instagram\.com\/tv\//
        ];

        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));
        
        if (!isValidUrl) {
            return reply("That is not a valid Instagram link. Please provide a valid Instagram post, reel, or video link.");
        }

        await dave.sendMessage(m.chat, {
            react: { text: '🔄', key: m.key }
        });

        const downloadData = await igdl(text);
        
        if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
            return reply("No media found at the provided link. The post might be private or the link is invalid.");
        }

        const mediaData = downloadData.data;
        
        // Simple deduplication - just remove exact URL duplicates
        const uniqueMedia = extractUniqueMedia(mediaData);
        
        // Limit to maximum 20 unique media items
        const mediaToDownload = uniqueMedia.slice(0, 20);
        
        if (mediaToDownload.length === 0) {
            return reply("No valid media found to download. This might be a private post or the scraper failed.");
        }

        // Download all media silently without status messages
        for (let i = 0; i < mediaToDownload.length; i++) {
            try {
                const media = mediaToDownload[i];
                const mediaUrl = media.url;

                // Check if URL ends with common video extensions
                const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) || 
                              media.type === 'video' || 
                              text.includes('/reel/') || 
                              text.includes('/tv/');

                if (isVideo) {
                    await dave.sendMessage(m.chat, {
                        video: { url: mediaUrl },
                        mimetype: "video/mp4",
                        caption: "DaveAI"
                    }, { quoted: m });
                } else {
                    await dave.sendMessage(m.chat, {
                        image: { url: mediaUrl },
                        caption: "DaveAI"
                    }, { quoted: m });
                }
                
                // Add small delay between downloads to prevent rate limiting
                if (i < mediaToDownload.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                
            } catch (mediaError) {
                console.error(`Error downloading media ${i + 1}:`, mediaError);
                // Continue with next media if one fails
            }
        }

    } catch (error) {
        console.error('Error in Instagram command:', error);
        reply("An error occurred while processing the Instagram request. Please try again.");
    }
};

daveplug.help = ['instagram'];
daveplug.tags = ['download'];
daveplug.command = ['instagram', 'ig'];

module.exports = daveplug;