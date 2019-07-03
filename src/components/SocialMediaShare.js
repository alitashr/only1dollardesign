import React, { Component } from 'react';

class SocialMediaShare extends Component {
    constructor(props) {
        super(props);
        this.shareOption =[{
            name: 'Facebook',
            href:"http://www.facebook.com/sharer.php?u=http://only1dollardesign.com/",
            imageSrc: './images/social_b__01.png'
        },
        {
            name: 'Pinterest',
            href:'http://pinterest.com/pin/create/button/?url=http://only1dollardesign.com/&amp;media=http://only1dollardesign.com/images/pin.jpg&amp;description=The best espresso around might cost you more than a dollar, but we are bringing you fresh design choices, for just a dollar each.',
            imageSrc: './images/social_b__03.png'
        },
        {
            name: 'Twitter',
            href:'http://twitter.com/share?url=http://only1dollardesign.com/&text=The best espresso around might cost you more than a dollar, but we are bringing you fresh design choices, for just a dollar each.',
            imageSrc: './images/social_b__02.png'
        },
        {
            name: 'LinkedIn',
            href:'http://www.linkedin.com/shareArticle?mini=true&url=http://only1dollardesign.com/?share',
            imageSrc: './images/social_b__04.png'
        }
        ]
    }
    
   
    render() {
        return (
            <div id="shareOption">
                {this.shareOption.length
                ?
                this.shareOption.map((media, index)=>
                    <a className="shareIcon" key={index} href={media.href} target="_blank">
                        <img src={media.imageSrc} alt= {media.alt}/>
                    </a>
                )
                :
                null
                }
            
            </div>
        );
    }
}

export default SocialMediaShare;