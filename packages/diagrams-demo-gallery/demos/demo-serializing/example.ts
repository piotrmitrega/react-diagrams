const s = `
{
    "id": "c0105ee4-c523-41b2-9fea-6ca58d1075b2",
    "nodes": {
        "f40a7549-97ea-4cae-a860-70d2e5708d51": {
            "id": "f40a7549-97ea-4cae-a860-70d2e5708d51",
            "type": "default",
            "x": 100,
            "y": 100,
            "ports": [{
                "id": "5422e6ca-d630-4a1f-bdb3-04daa46562bc",
                "type": "default",
                "x": 139.73751831054688,
                "y": 124.99999237060547,
                "name": "Out",
                "alignment": "right",
                "parentNode": "f40a7549-97ea-4cae-a860-70d2e5708d51",
                "links": [
                    "4f54cf34-7f41-4308-885a-d72f4e5fc4f1",
                    "61e016e7-90d0-413f-a8df-0d5c39cc1abf",
                    "3395051e-43ae-4698-a415-ae586ec17616"
                ],
                "in": false,
                "label": "Out"
            }],
            "name": "Node 1",
            "color": "rgb(0,192,255)",
            "portsInOrder": [],
            "portsOutOrder": ["5422e6ca-d630-4a1f-bdb3-04daa46562bc"]
        },
        "b8a0e023-558d-4270-9241-9c513e2f61a1": {
            "id": "b8a0e023-558d-4270-9241-9c513e2f61a1",
            "type": "default",
            "x": 400,
            "y": 100,
            "ports": [{
                "id": "16bb92c2-21cd-4aac-94bb-4e96f82fb067",
                "type": "default",
                "x": 402,
                "y": 124.99999237060547,
                "name": "In",
                "alignment": "left",
                "parentNode": "b8a0e023-558d-4270-9241-9c513e2f61a1",
                "links": [
                    "4f54cf34-7f41-4308-885a-d72f4e5fc4f1",
                    "f47e7a2c-4492-4ed4-af15-e6a916338896"
                ],
                "in": true,
                "label": "In"
            }],
            "name": "Node 2",
            "color": "rgb(192,255,0)",
            "portsInOrder": ["16bb92c2-21cd-4aac-94bb-4e96f82fb067"],
            "portsOutOrder": []
        },
        "eb0a1c11-f789-4f91-ba79-9175b751874b": {
            "id": "eb0a1c11-f789-4f91-ba79-9175b751874b",
            "type": "default",
            "x": 150,
            "y": 210.79999542236328,
            "ports": [{
                "id": "ee11bab4-b430-4d2c-b8f1-3764e581aed1",
                "type": "default",
                "x": 189.73751831054688,
                "y": 235.79999542236328,
                "name": "Out",
                "alignment": "right",
                "parentNode": "eb0a1c11-f789-4f91-ba79-9175b751874b",
                "links": ["f47e7a2c-4492-4ed4-af15-e6a916338896"],
                "in": false,
                "label": "Out"
            }],
            "name": "Node 3",
            "color": "rgb(0,192,255)",
            "portsInOrder": [],
            "portsOutOrder": ["ee11bab4-b430-4d2c-b8f1-3764e581aed1"]
        },
        "b4a751ea-809d-450d-a2ec-30c71a7f6949": {
            "id": "b4a751ea-809d-450d-a2ec-30c71a7f6949",
            "type": "default",
            "selected": false,
            "x": 248,
            "y": 45.79999542236328,
            "ports": [{
                "id": "649b91d6-2db5-4986-a262-afd4a0ee81f1",
                "type": "default",
                "x": 250,
                "y": 70.7874984741211,
                "name": "In",
                "alignment": "left",
                "parentNode": "b4a751ea-809d-450d-a2ec-30c71a7f6949",
                "links": ["61e016e7-90d0-413f-a8df-0d5c39cc1abf"],
                "in": true,
                "label": "In"
            }],
            "name": "Node 4",
            "color": "rgb(192,255,0)",
            "portsInOrder": ["649b91d6-2db5-4986-a262-afd4a0ee81f1"],
            "portsOutOrder": []
        },
        "b2ac67f8-7670-4853-999c-c8f6e4a26081": {
            "id": "b2ac67f8-7670-4853-999c-c8f6e4a26081",
            "type": "default",
            "selected": false,
            "x": 38,
            "y": 145.79999542236328,
            "ports": [{
                "id": "44d2f3cd-b894-4ec7-aac8-20e3ca156012",
                "type": "default",
                "x": 77.73748779296875,
                "y": 170.79999542236328,
                "name": "Out",
                "alignment": "right",
                "parentNode": "b2ac67f8-7670-4853-999c-c8f6e4a26081",
                "links": ["dabe6adb-deed-4a1d-945d-9cd72ef1c1f6"],
                "in": false,
                "label": "Out"
            }],
            "name": "Node 5",
            "color": "rgb(0,192,255)",
            "portsInOrder": [],
            "portsOutOrder": ["44d2f3cd-b894-4ec7-aac8-20e3ca156012"]
        },
        "7289b999-2b86-4ac7-bdf5-7149f103a459": {
            "id": "7289b999-2b86-4ac7-bdf5-7149f103a459",
            "type": "default",
            "selected": false,
            "x": 229,
            "y": 145.79999542236328,
            "ports": [{
                "id": "076146d1-198e-4a3a-a8cd-d3e317fd97a9",
                "type": "default",
                "x": 231,
                "y": 170.79999542236328,
                "name": "In",
                "alignment": "left",
                "parentNode": "7289b999-2b86-4ac7-bdf5-7149f103a459",
                "links": [
                    "dabe6adb-deed-4a1d-945d-9cd72ef1c1f6",
                    "3395051e-43ae-4698-a415-ae586ec17616"
                ],
                "in": true,
                "label": "In"
            }],
            "name": "Node 6",
            "color": "rgb(192,255,0)",
            "portsInOrder": ["076146d1-198e-4a3a-a8cd-d3e317fd97a9"],
            "portsOutOrder": []
        }
    },
    "links": {
        "4f54cf34-7f41-4308-885a-d72f4e5fc4f1": {
            "id": "4f54cf34-7f41-4308-885a-d72f4e5fc4f1",
            "type": "default",
            "source": "f40a7549-97ea-4cae-a860-70d2e5708d51",
            "sourcePort": "5422e6ca-d630-4a1f-bdb3-04daa46562bc",
            "target": "b8a0e023-558d-4270-9241-9c513e2f61a1",
            "targetPort": "16bb92c2-21cd-4aac-94bb-4e96f82fb067",
            "points": [{
                    "id": "b66988f3-4a39-40fb-829c-5f1380ac9332",
                    "type": "point",
                    "x": 147.23751831054688,
                    "y": 132.49999237060547
                },
                {
                    "id": "5ea8d4f9-b5a3-4f49-b9dd-0ea0e1fe36d4",
                    "type": "point",
                    "x": 409.5,
                    "y": 132.49999237060547
                }
            ],
            "labels": [],
            "width": 3,
            "color": "gray",
            "curvyness": 50,
            "selectedColor": "rgb(0,192,255)"
        },
        "dabe6adb-deed-4a1d-945d-9cd72ef1c1f6": {
            "id": "dabe6adb-deed-4a1d-945d-9cd72ef1c1f6",
            "type": "default",
            "selected": false,
            "source": "7289b999-2b86-4ac7-bdf5-7149f103a459",
            "sourcePort": "076146d1-198e-4a3a-a8cd-d3e317fd97a9",
            "target": "b2ac67f8-7670-4853-999c-c8f6e4a26081",
            "targetPort": "44d2f3cd-b894-4ec7-aac8-20e3ca156012",
            "points": [{
                    "id": "60c7131f-a6ad-49c1-a6a8-be9d9526db9e",
                    "type": "point",
                    "x": 238.5,
                    "y": 178.29999542236328
                },
                {
                    "id": "8b329f76-f6da-406e-a73c-852de74d1db9",
                    "type": "point",
                    "x": 85.23748779296875,
                    "y": 178.29999542236328
                }
            ],
            "labels": [],
            "width": 3,
            "color": "gray",
            "curvyness": 50,
            "selectedColor": "rgb(0,192,255)"
        },
        "f47e7a2c-4492-4ed4-af15-e6a916338896": {
            "id": "f47e7a2c-4492-4ed4-af15-e6a916338896",
            "type": "default",
            "selected": false,
            "source": "eb0a1c11-f789-4f91-ba79-9175b751874b",
            "sourcePort": "ee11bab4-b430-4d2c-b8f1-3764e581aed1",
            "target": "b8a0e023-558d-4270-9241-9c513e2f61a1",
            "targetPort": "16bb92c2-21cd-4aac-94bb-4e96f82fb067",
            "points": [{
                    "id": "b0846a17-db13-4392-8605-ada3e2960853",
                    "type": "point",
                    "x": 197.23751831054688,
                    "y": 243.29999542236328
                },
                {
                    "id": "58a40c0f-991d-4cc3-bb9b-857e172d3a4a",
                    "type": "point",
                    "x": 409.5,
                    "y": 132.49999237060547
                }
            ],
            "labels": [],
            "width": 3,
            "color": "gray",
            "curvyness": 50,
            "selectedColor": "rgb(0,192,255)"
        },
        "61e016e7-90d0-413f-a8df-0d5c39cc1abf": {
            "id": "61e016e7-90d0-413f-a8df-0d5c39cc1abf",
            "type": "default",
            "selected": false,
            "source": "b4a751ea-809d-450d-a2ec-30c71a7f6949",
            "sourcePort": "649b91d6-2db5-4986-a262-afd4a0ee81f1",
            "target": "f40a7549-97ea-4cae-a860-70d2e5708d51",
            "targetPort": "5422e6ca-d630-4a1f-bdb3-04daa46562bc",
            "points": [{
                    "id": "6515fe4d-485e-4376-8945-d7701365b950",
                    "type": "point",
                    "x": 257.5,
                    "y": 78.2874984741211
                },
                {
                    "id": "c221102c-bf34-43d7-adcf-d2cdc5efefd9",
                    "type": "point",
                    "x": 147.23751831054688,
                    "y": 132.49999237060547
                }
            ],
            "labels": [],
            "width": 3,
            "color": "gray",
            "curvyness": 50,
            "selectedColor": "rgb(0,192,255)"
        },
        "3395051e-43ae-4698-a415-ae586ec17616": {
            "id": "3395051e-43ae-4698-a415-ae586ec17616",
            "type": "default",
            "selected": false,
            "source": "f40a7549-97ea-4cae-a860-70d2e5708d51",
            "sourcePort": "5422e6ca-d630-4a1f-bdb3-04daa46562bc",
            "target": "7289b999-2b86-4ac7-bdf5-7149f103a459",
            "targetPort": "076146d1-198e-4a3a-a8cd-d3e317fd97a9",
            "points": [{
                    "id": "7310af82-84ed-4b73-8f6a-14b92c3a778d",
                    "type": "point",
                    "x": 147.23751831054688,
                    "y": 132.49999237060547
                },
                {
                    "id": "ad6ee533-291b-49c4-904a-c57c81153d28",
                    "type": "point",
                    "x": 238.5,
                    "y": 178.29999542236328
                }
            ],
            "labels": [],
            "width": 3,
            "color": "gray",
            "curvyness": 50,
            "selectedColor": "rgb(0,192,255)"
        }
    }
}
`;

export default s;
