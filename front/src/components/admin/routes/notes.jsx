import React from 'react'

const Notes = () => {
    return (
        <div>
            <p>Notes:</p>
            <ul>
                <li>We receive users' requests for promoting their ads in plan request section</li>
                <li>Users who requested featuring plans and paid through vodafone cash or bank account will be promoted manually by an admin who accepts their requests which appear in 'dashboard/requests'</li>
                <li>i disabled ssl in development mode so when you go to production mode, open vendor\guzzlehttp\guzzle\src\Handler\CurlFactory.php and enable ssl by:
                    <ul>
                        <li>changing:  $conf[CURLOPT_SSL_VERIFYHOST] = 0; $conf[CURLOPT_SSL_VERIFYPEER] = FALSE;</li>
                        <li>to: $conf[CURLOPT_SSL_VERIFYHOST] = 2; $conf[CURLOPT_SSL_VERIFYPEER] = true;</li>             
                    </ul>
                   </li>
            </ul>
        </div>
    )
}

export default Notes
