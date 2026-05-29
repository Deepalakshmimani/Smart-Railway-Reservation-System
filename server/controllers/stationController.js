import db from "../configs/db.js";

//Add Trains
export const addStation=async (req,res) => {

  try {
    const {station_name,station_code}=req.body;

    /*Validation*/

    if(!station_name || !station_code)
    {
      return res.json({success:false, message:"Missing Details"});
    }

    const [exisiting]=await db.execute(`SELECT * FROM stations WHERE station_code=?`,[station_code]);

    if(exisiting.length>0)
    {
      return res.json({success:false, message:"Stations already exists"});
    }

    await db.execute(`INSERT INTO stations (station_name,station_code) VALUES (?,?)`,[station_name,station_code]);

    return res.json({success:true,message:"Station Added"});



  } catch (error) {
    console.log(error.message);

    return res.json({success:false,message:error.message});
  }
  
};


//Get Trains
export const getStations=async(req,res)=>
{
  try {
    
    const [stations]=await db.execute(`SELECT * 
      FROM stations 
      WHERE is_active=true
      ORDER BY station_name ASC`);

    return res.json({success:true,stations});


  } catch (error) {

    console.log(error.message);
    return res.json({success:false,message:error.message});
    
  }
};


//Update Trains

export const updateStation =
async (req, res) => {

  try {

    const { id } = req.params;
    console.log(id);
    const {
      station_name,
      station_code
    } = req.body;

    await db.execute(

      `UPDATE stations
       SET
       station_name = ?,
       station_code = ?
       WHERE station_id = ?`,

      [
        station_name,
        station_code,
        id
      ]
    );

    return res.json({
      success: true,
      message:
        "Station Updated"
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: error.message
    });
  }
};




//DELETE STATION

export const deleteStation =
async (req, res) => {

  try {

    const { id } = req.params;

    /* Soft Delete */

    await db.execute(

      `UPDATE stations
       SET is_active = false
       WHERE station_id = ?`,

      [id]
    );

    return res.json({
      success: true,
      message:
        "Station Deleted"
    });

  } catch (error) {

    console.log(error);

    return res.json({
      success: false,
      message: error.message
    });
  }
};