import React from 'react';
import {ShareOption, ShareIcon} from './StyledComponents';
import facebook from '../images/social_b__01.png';
import pinterest from '../images/social_b__03.png';
import twitter from '../images/social_b__02.png';
import linkedIn from '../images/social_b__04.png';

const SocialMediaShare = () => {
    const shareOption = [{
        name: 'Facebook',
        href:"http://www.facebook.com/sharer.php?u=http://only1dollardesign.com/",
        imageSrc: facebook
    },
    {
        name: 'Pinterest',
        href:'http://pinterest.com/pin/create/button/?url=http://only1dollardesign.com/&amp;media=http://only1dollardesign.com/images/pin.jpg&amp;description=The best espresso around might cost you more than a dollar, but we are bringing you fresh design choices, for just a dollar each.',
        imageSrc: pinterest
    },
    {
        name: 'Twitter',
        href:'http://twitter.com/share?url=http://only1dollardesign.com/&text=The best espresso around might cost you more than a dollar, but we are bringing you fresh design choices, for just a dollar each.',
        imageSrc: twitter
    },
    {
        name: 'LinkedIn',
        href:'http://www.linkedin.com/shareArticle?mini=true&url=http://only1dollardesign.com/?share',
        imageSrc: linkedIn
    }
    ];

    return (
        <ShareOption>
            { 
                shareOption.length ?
                shareOption.map((media, index)=>
                    <ShareIcon key={index} href={media.href} target="_blank">
                        <img src={media.imageSrc} alt= {media.alt}/>
                    </ShareIcon>
                )
                :
                null
            }
        </ShareOption>
            
    );
};

export default SocialMediaShare;