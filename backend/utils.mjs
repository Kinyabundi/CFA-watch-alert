import counties_data from "./data/counties.json" ;
import * as turf from "@turf/turf";
import _ from "lodash";

const counties = counties_data.features;

// Create a function to predict
const predict = (x, y) => {
  // Loop through the counties
  for (let i = 0; i < counties.length; i++) {
    let poly = turf.polygon(counties[i].geometry.coordinates);

    // Check if the point is in the polygon
    if (turf.booleanPointInPolygon(turf.point([x, y]), poly)) {
      // Return the county
      return counties[i];
    }
  }

  // If no county is found, return null
  return null;
};

// Create a bulk predict
const bulk_predict = (data) => {
  let location_data = [];
  // Loop through the data
  //   print the no of items to predict
  console.log(`Predicting ${data.length} Items`);
  for (let i = 0; i < data.length; i++) {
    // Get the county
    let county = predict(data[i].longitude, data[i].latitude);

    console.log(`Predicted County Item ${i} of ${data.length}`);

    if (!county) {
      continue;
    }

    // Convert UTC time to EAT time
    const utcTime = new Date(data[i].alert__time_utc);
    const eatTime = utcTime.toLocaleString("en-US", {
      timeZone: "Africa/Nairobi",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    
    // Add the county to the data
    location_data.push({
      county: county.properties.COUNTY,
      date: data[i].alert__date,
      time: eatTime,
      count: data[i].alert__count,
    });
  }

  // Return the data
  return location_data;
};

const bulk_predict1 = async (data) => {
  const MAX_CONCURRENT_PROMISES = 10; // Adjust the number of concurrent promises as needed

  // Create an array to store the promises
  const promises = [];

  // Create a helper function to process a batch of data
  const processBatch = async (batch) => {
    const batchPromises = batch.map((item) => {
      return new Promise((resolve) => {
        const county = predict(item.longitude, item.latitude);

        console.log(`Predicted County Item ${item.index} of ${data.length}`);

        if (county) {
          resolve({
            county: county.properties.COUNTY,
            date: item.alert__date,
            time: item.alert__time_utc,
            count: item.alert__count,
          });
        } else {
          resolve(null);
        }
      });
    });

    const batchResults = await Promise.allSettled(batchPromises);

    return batchResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  };

  // Split the data into batches
  const batches = [];
  for (let i = 0; i < data.length; i += MAX_CONCURRENT_PROMISES) {
    const batch = data
      .slice(i, i + MAX_CONCURRENT_PROMISES)
      .map((item, index) => ({
        ...item,
        index: i + index,
      }));
    batches.push(batch);
  }

  // Process the batches in parallel
  const results = await Promise.all(
    batches.map((batch) => processBatch(batch))
  );

  // Flatten the results
  const location_data = results.flat();

  // Print the number of items predicted
  console.log(`Predicting ${data.length} Items`);

  return location_data;
};

const removeDuplicates = (items) => {
  const uniqueItems = _.uniqWith(items, _.isEqual);

  return uniqueItems;
};

// get unique county
const getCounties = (items) => {
  const counties = items.map((item) => item.county);

  const uniqueCounties = _.uniq(counties);

  return uniqueCounties;
};

// remove empty arrays from an array of arrays
const removeEmptyArrays = (items) => {
  const filteredItems = items.filter((item) => item.length > 0);

  return filteredItems;
};



export {
  predict,
  bulk_predict,
  bulk_predict1,
  removeDuplicates,
  getCounties,
  removeEmptyArrays,
};
