
export default class Utility {

    static createBackgroundImageStyle(image){
        
        const landImageStyle = {
            backgroundImage: `url(${image})`, 
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            width: '100vw',  //100% of the viewport width.
            minHeight: '100vh' 
         }
         return landImageStyle;
    }
   
    
}

