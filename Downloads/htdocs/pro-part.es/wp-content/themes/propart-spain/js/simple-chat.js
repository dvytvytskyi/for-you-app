/**
 * Simple AI Chat - Minimal Implementation with History
 */

(function($) {
    'use strict';

    const STORAGE_KEY = 'simple_ai_chat_history';
    const MAX_MESSAGES = 50; // Maximum messages to store

    $(document).ready(function() {
        initSimpleChat();
    });

    function initSimpleChat() {
        createChatModal();
        bindEvents();
        loadChatHistory(); // Load previous messages
    }

    // Load chat history from localStorage
    function loadChatHistory() {
        const history = getChatHistory();
        
        if (history.length === 0) {
            // Show welcome message and suggestions if no history
            showSuggestions();
            return;
        }
        
        // Clear welcome message and hide suggestions
        $('.simple-chat-welcome').remove();
        hideSuggestions();
        
        // Render all messages
        history.forEach(function(msg) {
            addMessageToUI(msg.text, msg.type, false); // false = don't save again
        });
    }

    // Get chat history from localStorage
    function getChatHistory() {
        try {
            const history = localStorage.getItem(STORAGE_KEY);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            console.error('Error loading chat history:', e);
            return [];
        }
    }

    // Save message to localStorage
    function saveChatMessage(text, type) {
        try {
            const history = getChatHistory();
            history.push({
                text: text,
                type: type,
                timestamp: Date.now()
            });
            
            // Limit history size
            const limitedHistory = history.slice(-MAX_MESSAGES);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
        } catch (e) {
            console.error('Error saving chat message:', e);
        }
    }

    // Clear chat history
    function clearChatHistory() {
        localStorage.removeItem(STORAGE_KEY);
        $('#simple-chat-messages').html('<div class="simple-chat-welcome">Hello! How can I help you?</div>');
        showSuggestions();
    }

    // Hide suggestions
    function hideSuggestions() {
        $('#simple-chat-suggestions-wrapper').addClass('hidden');
    }

    // Show suggestions
    function showSuggestions() {
        $('#simple-chat-suggestions-wrapper').removeClass('hidden');
    }

    // Create chat modal
    function createChatModal() {
        const modalHTML = `
            <div id="simple-chat-modal" class="simple-chat-modal" style="display: none;">
                <div class="simple-chat-container">
                    <div class="simple-chat-header">
                        <div class="simple-chat-header-left">
                            <h3>ProPart AI</h3>
                            <span class="simple-chat-plus">Plus</span>
                        </div>
                        <div class="simple-chat-header-actions">
                            <button class="simple-chat-new" title="Start new chat">
                                New Chat
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" fill="white"/>
                                    <path d="M16.894 20.567L16.5 22l-.394-1.433a2.25 2.25 0 00-1.423-1.423L13.25 19l1.433-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.433a2.25 2.25 0 001.423 1.423L19.75 19l-1.433.394a2.25 2.25 0 00-1.423 1.423z" fill="white"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="simple-chat-messages" id="simple-chat-messages">
                        <div class="simple-chat-welcome">
                            Hello! How can I help you?
                        </div>
                    </div>
                    
                    <div class="simple-chat-suggestions-wrapper" id="simple-chat-suggestions-wrapper">
                        <div class="simple-chat-suggestions-label">scroll to view more</div>
                        <div class="simple-chat-suggestions" id="simple-chat-suggestions">
                            <button class="simple-suggestion-btn" data-prompt="Apartment up to $1M">Apartment up to $1M</button>
                            <button class="simple-suggestion-btn" data-prompt="Villa in Marbella">Villa in Marbella</button>
                            <button class="simple-suggestion-btn" data-prompt="Buy for flipping">Buy for flipping</button>
                            <button class="simple-suggestion-btn" data-prompt="Sea view">Sea view</button>
                            <button class="simple-suggestion-btn" data-prompt="Investment property">Investment property</button>
                            <button class="simple-suggestion-btn" data-prompt="Penthouse with terrace">Penthouse with terrace</button>
                            <button class="simple-suggestion-btn" data-prompt="New construction">New construction</button>
                            <button class="simple-suggestion-btn" data-prompt="Beachfront property">Beachfront property</button>
                            <button class="simple-suggestion-btn" data-prompt="Golf resort area">Golf resort area</button>
                        </div>
                    </div>
                    
                    <div class="simple-chat-input">
                        <div class="simple-input-wrapper">
                            <svg class="simple-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 22l-.394-1.433a2.25 2.25 0 00-1.423-1.423L13.25 19l1.433-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.433a2.25 2.25 0 001.423 1.423L19.75 19l-1.433.394a2.25 2.25 0 00-1.423 1.423z" stroke="currentColor" stroke-width="1.5"/>
                            </svg>
                            <textarea id="simple-chat-input" rows="3" placeholder="What property are you looking for?"></textarea>
                        </div>
                        <div class="simple-input-actions">
                            <div class="simple-actions-left">
                                <button class="simple-action-btn" id="simple-close-btn" title="Close chat">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span>Close chat</span>
                                </button>
                            </div>
                            <div class="simple-actions-right">
                                <button class="simple-action-btn" id="test-property-btn" title="Test Property" style="background: #ef4444; color: white; border-color: #ef4444;">
                                    <span>🏠 Test</span>
                                </button>
                                <button class="simple-action-btn simple-send-btn" id="simple-chat-send">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <span>Send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Confirmation Modal -->
            <div id="simple-chat-confirm-modal" class="simple-confirm-modal" style="display: none;">
                <div class="simple-confirm-overlay"></div>
                <div class="simple-confirm-dialog">
                    <h3 class="simple-confirm-title">Start a new conversation?</h3>
                    <p class="simple-confirm-text">Current chat will be cleared. This action cannot be undone.</p>
                    <div class="simple-confirm-actions">
                        <button class="simple-confirm-cancel">Cancel</button>
                        <button class="simple-confirm-ok">New Chat</button>
                    </div>
                </div>
            </div>
        `;
        $('body').append(modalHTML);
    }

    // Open modal
    function openModal() {
        $('#simple-chat-modal').fadeIn(200);
        $('body').css('overflow', 'hidden');
        
        // Scroll to bottom after modal is visible
        setTimeout(function() {
            scrollToBottom();
            $('#simple-chat-input').focus();
        }, 100);
    }

    // Close modal
    function closeModal() {
        $('#simple-chat-modal').fadeOut(200);
        $('body').css('overflow', '');
    }

    // Show confirmation modal
    function showConfirmation(callback) {
        $('#simple-chat-confirm-modal').fadeIn(200);
        
        // Store callback for later use
        $('#simple-chat-confirm-modal').data('callback', callback);
    }

    // Hide confirmation modal
    function hideConfirmation() {
        $('#simple-chat-confirm-modal').fadeOut(200);
        $('#simple-chat-confirm-modal').removeData('callback');
    }

    // Bind events
    function bindEvents() {
        // Open modal (header button on home page)
        $(document).on('click', '#simple-ai-btn-home', function() {
            openModal();
        });
        
        // Open modal (main page AI button)
        $(document).on('click', '#mainPageBtnAI', function() {
            openModal();
        });

        // New chat button
        $(document).on('click', '.simple-chat-new', function() {
            showConfirmation(function() {
                clearChatHistory();
            });
        });

        // Confirmation modal - OK button
        $(document).on('click', '.simple-confirm-ok', function() {
            const callback = $('#simple-chat-confirm-modal').data('callback');
            if (callback) {
                callback();
            }
            hideConfirmation();
        });

        // Confirmation modal - Cancel button
        $(document).on('click', '.simple-confirm-cancel', function() {
            hideConfirmation();
        });

        // Confirmation modal - Close on overlay click
        $(document).on('click', '.simple-confirm-overlay', function() {
            hideConfirmation();
        });
        
        // Close modal on background click
        $(document).on('click', '#simple-chat-modal', function(e) {
            if (e.target.id === 'simple-chat-modal') {
                closeModal();
            }
        });

        // Send message on button click
        $(document).on('click', '#simple-chat-send', function() {
            sendMessage();
        });

        // Send message on Enter (Shift+Enter for new line)
        $(document).on('keypress', '#simple-chat-input', function(e) {
            if (e.which === 13 && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Close chat button
        $(document).on('click', '#simple-close-btn', function() {
            closeModal();
        });

        // Suggestion buttons
        $(document).on('click', '.simple-suggestion-btn', function() {
            const prompt = $(this).data('prompt');
            $('#simple-chat-input').val(prompt);
            sendMessage();
            hideSuggestions();
        });

        // Test property card (temporary)
        $(document).on('click', '#test-property-btn', function() {
            showPropertyCard({
                title: "Luxury Villa in Nueva Andalucia",
                location: "Marbella, Costa del Sol",
                price: "€2,450,000",
                image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
                bedrooms: 5,
                bathrooms: 4,
                area: "450 m²",
                type: "Villa",
                link: "#"
            });
        });

        // Property actions
        $(document).on('click', '.simple-property-action[data-action="remove"]', function() {
            const $card = $(this).closest('.simple-property-card');
            $card.fadeOut(200, function() {
                $(this).remove();
            });
        });

        $(document).on('click', '.simple-property-action[data-action="add"]', function() {
            // Placeholder for add to collection functionality
            alert('Property added to collection!');
        });

        // Hide suggestions when user starts typing
        $(document).on('input', '#simple-chat-input', function() {
            if ($(this).val().trim().length > 0) {
                hideSuggestions();
            }
        });

        // Close modal on Escape key
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape' && $('#simple-chat-modal').is(':visible')) {
                closeModal();
            }
        });
    }

    // Send message
    function sendMessage() {
        const $input = $('#simple-chat-input');
        const message = $input.val().trim();
        
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        $input.val('');

        // Show typing indicator
        addTyping();
        
        // Get conversation history (last 10 messages)
        const history = getChatHistory().slice(-10);

        // Call API
        $.ajax({
            url: simpleAI.apiUrl,
            type: 'POST',
            contentType: 'application/json',
            timeout: 30000,
            headers: {
                'X-WP-Nonce': simpleAI.nonce
            },
            data: JSON.stringify({ 
                message: message,
                history: history 
            }),
            success: function(response) {
                removeTyping();
                if (response.success) {
                    addMessageWithTypingEffect(response.message, 'ai');
                } else {
                    addMessage('Sorry, an error occurred', 'ai');
                }
            },
            error: function() {
                removeTyping();
                addMessage('Could not connect to AI. Please try again.', 'ai');
            }
        });
    }

    // Add message with typing effect (word by word)
    function addMessageWithTypingEffect(text, type) {
        // Remove welcome message and hide suggestions if present
        $('.simple-chat-welcome').remove();
        hideSuggestions();
        
        const messageClass = type === 'user' ? 'simple-message-user' : 'simple-message-ai';
        const messageId = 'msg-' + Date.now();
        
        // Create empty message container with typing class
        const messageHTML = `<div id="${messageId}" class="${messageClass} typing"></div>`;
        $('#simple-chat-messages').append(messageHTML);
        
        const $message = $('#' + messageId);
        
        // Handle line breaks
        const lines = text.split('\n');
        const allWords = [];
        
        lines.forEach(function(line, lineIndex) {
            const words = line.split(' ');
            words.forEach(function(word) {
                allWords.push(word);
            });
            // Add line break marker except for last line
            if (lineIndex < lines.length - 1) {
                allWords.push('\n');
            }
        });
        
        let currentIndex = 0;
        let displayedText = '';
        
        // Add words one by one
        const typingInterval = setInterval(function() {
            if (currentIndex < allWords.length) {
                const word = allWords[currentIndex];
                
                if (word === '\n') {
                    displayedText += '\n';
                } else {
                    displayedText += (currentIndex > 0 && allWords[currentIndex - 1] !== '\n' ? ' ' : '') + word;
                }
                
                // Preserve line breaks in HTML
                $message.html(displayedText.replace(/\n/g, '<br>'));
                scrollToBottom();
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                // Remove typing cursor
                $message.removeClass('typing');
                // Save to history after animation completes
                saveChatMessage(text, type);
            }
        }, 50); // 50ms between words
    }

    // Add message to chat (wrapper that saves to history)
    function addMessage(text, type) {
        addMessageToUI(text, type, true);
    }

    // Add message to UI
    function addMessageToUI(text, type, saveToHistory) {
        // Remove welcome message and hide suggestions if present
        $('.simple-chat-welcome').remove();
        hideSuggestions();
        
        const messageClass = type === 'user' ? 'simple-message-user' : 'simple-message-ai';
        const messageHTML = `
            <div class="${messageClass}">
                ${escapeHtml(text)}
            </div>
        `;
        $('#simple-chat-messages').append(messageHTML);
        scrollToBottom();
        
        // Save to localStorage
        if (saveToHistory) {
            saveChatMessage(text, type);
        }
    }

    // Add typing indicator
    function addTyping() {
        const typingHTML = `
            <div class="simple-typing">
                <span></span><span></span><span></span>
            </div>
        `;
        $('#simple-chat-messages').append(typingHTML);
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTyping() {
        $('.simple-typing').remove();
    }

    // Scroll to bottom
    function scrollToBottom() {
        const $messages = $('#simple-chat-messages');
        $messages.scrollTop($messages[0].scrollHeight);
    }

    // Escape HTML
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    // Show property card
    function showPropertyCard(property) {
        // Remove welcome message and hide suggestions
        $('.simple-chat-welcome').remove();
        hideSuggestions();
        
        const propertyHTML = `
            <div class="simple-property-card">
                <div class="simple-property-image" style="background-image: url('${property.image}')"></div>
                <div class="simple-property-content">
                    <div class="simple-property-info">
                        <h4 class="simple-property-title">${property.title}</h4>
                        <div class="simple-property-price">${property.price}</div>
                        <div class="simple-property-bottom">
                            <div class="simple-property-features">
                                <span>${property.bedrooms} bed</span>
                                <span>•</span>
                                <span>${property.bathrooms} bath</span>
                                <span>•</span>
                                <span>${property.area}</span>
                            </div>
                            <div class="simple-property-actions">
                                <button class="simple-property-action" data-action="remove">remove</button>
                                <button class="simple-property-action" data-action="add">add</button>
                                <a href="${property.link}" class="simple-property-action" target="_blank">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    open
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        $('#simple-chat-messages').append(propertyHTML);
        scrollToBottom();
    }

})(jQuery);

