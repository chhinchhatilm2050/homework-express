import { database } from "../db.js";
const memberCollection = database.collection('members');
const insertMembers = async (req, res) => {
  try {
    const members = req.body; 
    if (!Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of members' });
    }
    const result = await memberCollection.insertMany(members);
    res.status(201).json({
      message: 'Members inserted successfully',
      data: result
    });
    console.log(`Insert ${result.insertedCount} members`)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const findAllMember = async (req, res) => {
    try {
        const result = await memberCollection.find({}).toArray();
        if(result.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Member not found!'
            });
        }
        console.log(`All Members (${result.length} total):`);
        result.forEach(member => {
        console.log(`- ${member.name} (${member.membershipId})`);
        });
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export { insertMembers, memberCollection, findAllMember };