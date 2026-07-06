FROM nginx:1.27-alpine

# Copy configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Create log directory
RUN mkdir -p /var/log/nginx

# Expose ports
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
