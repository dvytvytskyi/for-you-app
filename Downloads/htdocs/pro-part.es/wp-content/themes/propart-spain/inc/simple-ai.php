<?php
/**
 * Simple AI Chat - Minimal Implementation
 * Just request/response, no history, no database
 * 
 * @package propart-spain
 */

class Simple_AI_Chat {
    
    private $api_key = 'AIzaSyBz2f4qXRAAoSMOfMWkDoG-slFIu64BKiU';
    private $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    /**
     * Send message to AI and get response
     * 
     * @param string $message User message
     * @param array $history Previous messages
     * @return array {success: bool, message: string}
     */
    public function chat($message, $history = array()) {
        $response = $this->call_api($message, $history);
        
        if (is_wp_error($response)) {
            error_log('AI Chat Error: ' . $response->get_error_message());
            
            return array(
                'success' => false,
                'message' => 'Не вдалося зв\'язатися з AI. Спробуйте ще раз.'
            );
        }
        
        $text = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
        
        if (empty($text)) {
            return array(
                'success' => false,
                'message' => 'AI не зміг згенерувати відповідь'
            );
        }
        
        return array(
            'success' => true,
            'message' => trim($text)
        );
    }
    
    /**
     * Call Gemini API with conversation history
     */
    private function call_api($message, $history = array()) {
        $url = $this->api_url . '?key=' . $this->api_key;
        
        // System prompt
        $system_instruction = "Ти - AI-асистент з нерухомості на Costa del Sol (Іспанія).
Відповідай ТІЛЬКИ українською, коротко і дружньо.
БЕЗ емодзі та спеціальних символів.
Запам'ятовуй контекст розмови та відповідай логічно з урахуванням попередніх повідомлень.";
        
        // Build conversation contents
        $contents = array();
        
        // Add history
        if (!empty($history)) {
            foreach ($history as $msg) {
                $role = $msg['type'] === 'user' ? 'user' : 'model';
                $contents[] = array(
                    'role' => $role,
                    'parts' => array(
                        array('text' => $msg['text'])
                    )
                );
            }
        }
        
        // Add current user message
        $contents[] = array(
            'role' => 'user',
            'parts' => array(
                array('text' => $message)
            )
        );
        
        $body = array(
            'system_instruction' => array(
                'parts' => array(
                    array('text' => $system_instruction)
                )
            ),
            'contents' => $contents,
            'generationConfig' => array(
                'temperature' => 0.7,
                'maxOutputTokens' => 300,
            )
        );
        
        $response = wp_remote_post($url, array(
            'timeout' => 30,
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode($body)
        ));
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $status = wp_remote_retrieve_response_code($response);
        $body_response = wp_remote_retrieve_body($response);
        
        if ($status !== 200) {
            return new WP_Error('api_error', 'API Error: ' . $status);
        }
        
        return json_decode($body_response, true);
    }
}

