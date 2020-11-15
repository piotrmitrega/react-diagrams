const s = `
{
  "id": "6ed95cb6-3c69-477d-9044-915e17136c07",
  "nodes": {
    "e202b135-dfba-4509-abc4-1d7144a10ba8": {
      "id": "e202b135-dfba-4509-abc4-1d7144a10ba8",
      "type": "default",
      "x": 100,
      "y": 100,
      "ports": [
        {
          "id": "81b36dac-f41f-4e92-a152-cc61608ed72f",
          "type": "default",
          "x": 132.47500610351562,
          "y": 124.99999237060547,
          "name": "Out",
          "alignment": "right",
          "parentNode": "e202b135-dfba-4509-abc4-1d7144a10ba8",
          "links": [
            "580fea55-da4e-4087-b1b1-df806fde8d4b",
            "5c441d9e-7e7e-485c-9528-59e33b250bf1"
          ],
          "in": false
        }
      ],
      "name": "Node 1",
      "color": "rgb(0,192,255)",
      "portsInOrder": [],
      "portsOutOrder": [ "81b36dac-f41f-4e92-a152-cc61608ed72f" ]
    },
    "f488a8fa-4e14-41ea-973f-6a62a0761042": {
      "id": "f488a8fa-4e14-41ea-973f-6a62a0761042",
      "type": "default",
      "x": 400,
      "y": 100,
      "ports": [
        {
          "id": "6de0972e-df47-46dc-99ae-c0de5862a6d2",
          "type": "default",
          "x": 402,
          "y": 124.99999237060547,
          "name": "In",
          "alignment": "left",
          "parentNode": "f488a8fa-4e14-41ea-973f-6a62a0761042",
          "links": [ "580fea55-da4e-4087-b1b1-df806fde8d4b" ],
          "in": true
        }
      ],
      "name": "Node 2",
      "color": "rgb(192,255,0)",
      "portsInOrder": [ "6de0972e-df47-46dc-99ae-c0de5862a6d2" ],
      "portsOutOrder": []
    },
    "a393f020-49d9-4691-a868-49fce3f83ee8": {
      "id": "a393f020-49d9-4691-a868-49fce3f83ee8",
      "type": "default",
      "selected": false,
      "x": 178,
      "y": -5.200004577636719,
      "ports": [
        {
          "id": "56062376-317b-4c4e-a96c-a85638643604",
          "type": "default",
          "x": 180,
          "y": 19.79999542236328,
          "name": "In",
          "alignment": "left",
          "parentNode": "a393f020-49d9-4691-a868-49fce3f83ee8",
          "links": [ "5c441d9e-7e7e-485c-9528-59e33b250bf1" ],
          "in": true
        }
      ],
      "name": "Node 4",
      "color": "rgb(192,255,0)",
      "portsInOrder": [ "56062376-317b-4c4e-a96c-a85638643604" ],
      "portsOutOrder": []
    }
  },
  "links": {
    "580fea55-da4e-4087-b1b1-df806fde8d4b": {
      "id": "580fea55-da4e-4087-b1b1-df806fde8d4b",
      "type": "rightAngle",
      "selected": false,
      "source": "e202b135-dfba-4509-abc4-1d7144a10ba8",
      "sourcePort": "81b36dac-f41f-4e92-a152-cc61608ed72f",
      "target": "f488a8fa-4e14-41ea-973f-6a62a0761042",
      "targetPort": "6de0972e-df47-46dc-99ae-c0de5862a6d2",
      "points": [
        {
          "id": "10a30501-125b-49ca-8df6-42573a212542",
          "type": "point",
          "x": 139.97500610351562,
          "y": 132.49999237060547
        },
        {
          "id": "3f6c52b5-19a0-413f-a239-1aa2c64de893",
          "type": "point",
          "x": 139.97500610351562,
          "y": 226.79999542236328
        },
        {
          "id": "20bf72f6-527d-4aa6-bc09-c7a5f16336c4",
          "type": "point",
          "x": 409.5,
          "y": 226.79999542236328
        },
        {
          "id": "7cdf974e-9fa9-43e7-853b-b13e3a60dd82",
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
    "5c441d9e-7e7e-485c-9528-59e33b250bf1": {
      "id": "5c441d9e-7e7e-485c-9528-59e33b250bf1",
      "type": "rightAngle",
      "selected": false,
      "source": "a393f020-49d9-4691-a868-49fce3f83ee8",
      "sourcePort": "56062376-317b-4c4e-a96c-a85638643604",
      "target": "e202b135-dfba-4509-abc4-1d7144a10ba8",
      "targetPort": "81b36dac-f41f-4e92-a152-cc61608ed72f",
      "points": [
        {
          "id": "7e0f23d8-29d9-4e32-a6bf-03ef05ea7bfb",
          "type": "point",
          "x": 187.5,
          "y": 27.29999542236328
        },
        {
          "id": "fed1cd9f-4453-4823-a707-e72ffdc2411e",
          "type": "point",
          "x": 187.5,
          "y": 27.29999542236328
        },
        {
          "id": "e6d91eb0-649e-46b1-8f18-52087280c900",
          "type": "point",
          "x": 187.5,
          "y": 132.49999237060547
        },
        {
          "id": "26030443-0c8b-4da6-8e8f-5ebd5138014e",
          "type": "point",
          "x": 139.97500610351562,
          "y": 132.49999237060547
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
