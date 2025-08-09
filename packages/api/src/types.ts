import {Arr, Num, Obj, Str} from "@cloudflare/itty-router-openapi";

export const CabinetInfo = {
	game: String,
	units: new Num({ required: false }),
	versionName: new Str({ required: false }),
	remarks: new Str({ required: false }),
};

export const ContextInfo = {
	allNetCt: new Str({ required: false }),
	allNetAt: new Str({ required: false }),
	allNetSid: new Str({ required: false }),
	allNetGm: new Str({ required: false }),
	eAmusementFdesc: new Str({ required: false }),
}

export const Store = {
	country: String,
	area: String,
	alternateArea: new Str({ required: false }),
	storeName: String,
	alternateStoreName: new Str({ required: false }),
	address: String,
	alternateAddress: new Str({ required: false }),
	access: new Str({ required: false }),
	lat: Number,
	lng: Number,
	openingHours: new Str({ required: false }),
	brand: new Str({ required: false }),
	cabinets: new Arr({ innerType: CabinetInfo }),
	context: new Obj({ fields: ContextInfo }),
};
