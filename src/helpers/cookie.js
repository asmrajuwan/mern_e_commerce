const setAccessTokenCoolie= (res,accessToken)=>{
    res.cookie('accessToken',accessToken,{
        maxAge:5*60*1000, //15min
        httpOnly: true,
        //secure:true,
        sameSite: 'none'
    });
}

const setRefershTokenCoolie =(res,refreshToken)=>{
    res.cookie('refreshToken',refreshToken,{
        maxAge:7*24*60*60*1000, //7 days
        httpOnly: true,
        //secure:true,
        sameSite: 'none'
    });
}

module.exports={setAccessTokenCoolie,setRefershTokenCoolie};