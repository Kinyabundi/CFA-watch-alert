import moongose from 'mongoose';

const CFASchema = new moongose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phoneNo: {
            type: String,
            required: true,
            unqiue: true,
        },
        nationalId: {
            type: String,
            required: true,
            unqiue: true,
        },
        location: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const CFA = moongose.model('CFAMember', CFASchema);

export default CFA;