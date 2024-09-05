# Step 1: Use an official Nginx image as the base image
FROM nginx:alpine

# Step 2: Copy the HTML, CSS, and JS files to the appropriate location in the container
COPY . /usr/share/nginx/html

# Step 3: Expose port 80 to the outside world
EXPOSE 80

# Step 4: Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
